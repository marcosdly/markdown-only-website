import github from "../../assets/icons/svg/github_alt.svg";

export interface CharacterInfo {
  letter: string;
  iconPath: string | null;
  url: string | null;
}

export const text: string = "marcosdly.dev";

export const icons: [string, string][] = [[github, "https://github.com/marcosdly"]];

export const characters: CharacterInfo[] = text.split("").map((letter, i) => ({
  letter: letter,
  iconPath: icons[i]?.[0] || null,
  url: icons[i]?.[1] || null,
}));
