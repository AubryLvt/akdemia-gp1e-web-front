import { SubTheme } from "./SubTheme";

export interface Theme {
    id              : number;
    themeTitle      : string;
    description     : string;
    creationDate    : Date;
    updateDate      : Date;
    // Liste des sous-thèmes associés à ce thème, de type tableau d'objets SubTheme
    subThemes       : SubTheme[];
}