const config: MiraiBookConfig = {
  size: "105mm 173mm",
  title: "(本のタイトル)",
  author: "(著者名)",
  publisher: "(サークル名)",
  printer: "(印刷所名)",
  editions: [
    {
      name: "初版発行",
      datetime: "2024-05-21",
      datetimeView: "2024年5月21日",
      version: "v1.0.0",
    },
  ],
  profiles: [
    {
      position: "(役職など)",
      name: "(名前)",
      description: `自己紹介文を書く<br />
brタグで改行ができます。`,
      image: "../images/(プロファイル画像を置いて指定する).png",
    },
  ],
  cover: {
    // TODO: 表紙画像が必要な場合は置いて指定してください
    // front: "front-cover.png",
    // back: "back-cover.png",
    // start: "start-cover.png",
    // end: "end-cover.png",
  },
  copyright: "(コピーライトを書く)",
};
export default config;

export interface MiraiBookConfig {
  size: "JIS-B5" | "105mm 173mm";
  title: string;
  author: string;
  publisher: string;
  printer: string;
  editions: {
    name: string;
    datetime: string;
    datetimeView: string;
    version: string;
  }[];
  profiles: {
    position: string;
    name: string;
    description: string;
    image: string;
  }[];
  cover: {
    front?: string;
    back?: string;
    start?: string;
    end?: string;
  };
  copyright: string;
}