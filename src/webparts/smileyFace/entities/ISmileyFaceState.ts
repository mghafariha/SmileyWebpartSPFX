
import {IUser} from './IUser';

export interface ISmileyFaceState{
    status:string;
    items:any[];
    currentUser :IUser;
    hasUserData:boolean;
    isLoading:boolean;
}