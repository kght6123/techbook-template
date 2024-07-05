import { type Element, type ElementContent, type Root } from 'hast'
import { toText } from 'hast-util-to-text'
import { parse } from 'space-separated-tokens'
import { type Plugin } from 'unified'
import visitParents from 'unist-util-visit-parents'
import { type VFile } from 'vfile'
import { ParseMDDOptions, renderMermaid } from "@mermaid-js/mermaid-cli"
import puppeteer, { PuppeteerLaunchOptions, Browser } from "puppeteer";

interface CodeInstance {
  /**
   * The mermaid diagram.
   */
  diagram: string

  /**
   * The inclusive ancestors of the element to process.
   */
  ancestors: Element[]
}

export interface RenderResult {
  /**
   * The aria description of the diagram.
   */
  description?: string

  /**
   * The DOM id of the SVG node.
   */
  id: string

  /**
   * The diagram SVG rendered as a PNG buffer.
   */
  screenshot?: Buffer

  /**
   * The title of the rendered diagram.
   */
  title?: string
}

let browser: Browser = undefined

/**
 * A regular expression to test for non-whitespace characters.
 */
const nonWhitespacePattern = /\w/

/**
 * Allowed output strategies.
 */
type Strategy = 'img-png' | 'pre-mermaid'

const strategies: Strategy[] = ['img-png', 'pre-mermaid']

/**
 * Validate the strategy option is valid.
 *
 * @param strategy
 *   The user provided strategy.
 * @returns
 *   The strategy if valid.
 */
function validateStrategy(strategy: Strategy | undefined = 'img-png'): Strategy {
  if (strategies.includes(strategy)) {
    return strategy
  }
  throw new Error(`Expected strategy to be one of ${strategies.join(', ')}, got: ${strategy}`)
}

/**
 * Check if a hast element has the `language-mermaid` class name.
 *
 * @param element
 *   The hast element to check.
 * @param strategy
 *   The mermaid strategy to use.
 * @returns
 *   Whether or not the element has the `language-mermaid` class name.
 */
function isMermaidElement(element: Element, strategy: Strategy): boolean {
  let mermaidClassName: string

  if (element.tagName === 'pre') {
    if (strategy === 'pre-mermaid') {
      return false
    }
    mermaidClassName = 'mermaid'
  } else if (element.tagName === 'code') {
    mermaidClassName = 'language-mermaid'
  } else {
    return false
  }

  let className = element.properties?.className
  if (typeof className === 'string') {
    className = parse(className)
  }

  if (!Array.isArray(className)) {
    return false
  }

  return className.includes(mermaidClassName)
}

/**
 * Convert a render result to a data URI.
 *
 * @param result
 *   The render result to turn into a data URI.
 * @returns
 *   The data URI.
 */
function toDataURI(result: RenderResult): string {
  if (result.screenshot) {
    return `data:image/png;base64,${result.screenshot.toString('base64')}`
  }
}

/**
 * Convert a Mermaid render result to a hast element.
 *
 * @param light
 *   The light Mermaid render result.
 * @param dark
 *   The dark mermaid render result.
 * @param colorScheme
 *   The default color scheme.
 * @returns
 *   If a dark render result exists, a responsive `<picture>` element that favors light mode.
 *   Otherwise an `<img>` element containing only the light mode result.
 */
function toImageElement(
  light: RenderResult
): Element {
  const imgResult: RenderResult = light
  const img: Element = {
    type: 'element',
    tagName: 'img',
    properties: {
      alt: imgResult.description || '',
      id: imgResult.id,
      src: toDataURI(imgResult),
      title: imgResult.title,
    },
    children: []
  }
  return img
}

/**
 * Handle an error.
 *
 * If the error fallback is defined, use its result. Otherwise an error is thrown.
 *
 * @param reason
 *   The reason the error occurred.
 * @param instance
 *   The diagram code instance.
 * @param file
 *   The file on which the error should be reported.
 * @param options
 *   The render options.
 * @returns
 *   The error fallback renderer.
 */
function handleError(
  reason: string,
  instance: CodeInstance,
  file: VFile,
  options: RehypeMermaidOptions | undefined
// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
): ElementContent | null | undefined | void {
  const { ancestors, diagram } = instance
  if (options?.errorFallback) {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    return  options.errorFallback(ancestors.at(-1)!, diagram, reason, file)
  }

  const message = file.message(reason, {
    ruleId: 'rehype-mermaid',
    source: 'rehype-mermaid',
    ancestors
  } as unknown as Element)
  message.fatal = true
  message.url = 'https://github.com/kght6123/rehype-mermaid'
  throw message
}

export interface RehypeMermaidOptions {

  /**
   * Create a fallback node if processing of a mermaid diagram fails.
   *
   * @param element
   *   The hast element that could not be rendered.
   * @param diagram
   *   The Mermaid diagram that could not be rendered.
   * @param error
   *   The error that was thrown.
   * @param file
   *   The file on which the error occurred.
   * @returns
   *   A fallback node to render instead of the invalid diagram. If nothing is returned, the code
   *   block is removed
   */
  errorFallback?: (
    element: Element,
    diagram: string,
    error: unknown,
    file: VFile
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
)  => ElementContent | null | undefined | void

  /**
   * How to insert the rendered diagram into the document.
   *
   * - `'img-png'`: An `<img>` tag with the diagram as a base64 PNG data URL.
   * - `'pre-mermaid'`: The raw mermaid diagram as a child of a `<pre class="mermaid">` element.
   *
   * @default 'inline-svg'
   */
  strategy?: Strategy
}

/**
 * A [rehype](https://rehype.js.org) plugin to render [mermaid](https://mermaid-js.github.io)
 * diagrams.
 *
 * @param options
 *   Options that may be used to tweak the output.
 */
const rehypeMermaid: Plugin<[RehypeMermaidOptions?], Root> = (options) => {
  const strategy = validateStrategy(options?.strategy)
  const prefix = 'rehype-mermaid'
  const outputFormat = "png"
  const parseMMDOptions: ParseMDDOptions = {}
  const puppeteerConfig: PuppeteerLaunchOptions = ({
    headless: "new"
  })
  const renderDiagrams = (() => (diagrams: string[], renderOptions: RehypeMermaidOptions | undefined): Promise<PromiseSettledResult<RenderResult>[]> => {
    return Promise.allSettled(
      diagrams.map(async (diagram, index) => {
        try {
          if (browser === undefined) {
            browser = await puppeteer.launch(puppeteerConfig)
          }
          const id = `${prefix}-${index}`  
          const { title, desc, data } = await renderMermaid(browser, diagram, outputFormat, parseMMDOptions);
          return {
            id,
            screenshot: data,
            title,
            description: desc,
          }
        } catch (error) {
          throw error instanceof Error
            ? { name: error.name, stack: error.stack, message: error.message }
            : error
        }
      })
    )
  })();
  return (ast, file) => {
    const instances: CodeInstance[] = []

    visitParents(ast, 'element', (node: Element, ancestors) => {
      if (!isMermaidElement(node, strategy)) {
        return
      }

      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const  parent = ancestors.at(-1)! as Element
      let inclusiveAncestors = ancestors as Element[]

      // This is <code> wrapped in a <pre> element.
      if (parent.type === 'element' && parent.tagName === 'pre') {
        for (const child of parent.children) {
          // We allow whitespace text siblings, but any other siblings mean we don’t process the
          // diagram.
          if (child.type === 'text') {
            if (nonWhitespacePattern.test(child.value)) {
              return
            }
          } else if (child !== node) {
            return
          }
        }
      } else {
        inclusiveAncestors = [...inclusiveAncestors, node]
      }

      instances.push({
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        diagram: toText(node as any, { whitespace: 'pre' }),
        ancestors: inclusiveAncestors
      })
    })

    // Nothing to do. No need to start a browser in this case.
    if (!instances.length) {
      return
    }

    if (strategy === 'pre-mermaid') {
      for (const { ancestors, diagram } of instances) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const  parent = ancestors.at(-2)!
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const  node = ancestors.at(-1)!

        parent.children[parent.children.indexOf(node)] = {
          type: 'element',
          tagName: 'pre',
          properties: {
            className: ['mermaid']
          },
          children: [{ type: 'text', value: diagram }]
        }
      }
      return
    }

    const promises = [
      renderDiagrams(
        instances.map((instance) => instance.diagram),
        { ...options }
      )
    ]

    return Promise.all(promises).then(([lightResults]) => {
      for (const [index, instance] of instances.entries()) {
        const lightResult = lightResults[index]
        // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
        let  replacement: ElementContent | null | undefined | void

        if (lightResult.status === 'rejected') {
          replacement = handleError(lightResult.reason, instance, file as unknown as VFile, options)
        } else {
          replacement = toImageElement(lightResult.value)
        }

        const { ancestors } = instance
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const  node = ancestors.at(-1)!
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const  parent = ancestors.at(-2)!
        const nodeIndex = parent.children.indexOf(node)
        if (replacement) {
          parent.children[nodeIndex] = replacement
        } else {
          parent.children.splice(nodeIndex, 1)
        }
      }
    }).finally(() => {
      if (browser !== undefined) {
        browser.close()
        browser = undefined
      }
    })
  }
}

export default rehypeMermaid