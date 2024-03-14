import { Requirement } from "./Requirement";
export interface Session{

    id                  : number;
    type                : string;
    code                : number
    description         : string;
    nbinscriptionmini   : number;
    status              : string;
    duration            : number;
    creationDate        : Date;
    date                : Date ;
    location            : string;
    price               : number;
    trainer             : string;
    lastName            : string;
    training            : string;

}