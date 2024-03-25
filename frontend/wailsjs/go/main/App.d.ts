// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {monitor} from '../models';
import {updater} from '../models';
import {userconf} from '../models';
import {smartermail} from '../models';

export function AddServer(arg1:string,arg2:string,arg3:string):Promise<void>;

export function AddServers(arg1:Array<monitor.ServerDto>):Promise<void>;

export function CheckUpdate(arg1:boolean):Promise<updater.CheckUpdateRes>;

export function CreateDatabase(arg1:string,arg2:string):Promise<void>;

export function CreateDatabaseFromLegacy(arg1:string,arg2:string,arg3:string,arg4:string):Promise<void>;

export function DeleteServer(arg1:string):Promise<void>;

export function GetCurrentVersion():Promise<string>;

export function Load(arg1:string,arg2:string):Promise<void>;

export function LoadUserConfig():Promise<userconf.Config>;

export function Refresh():Promise<void>;

export function SaveUserConfig(arg1:userconf.Config):Promise<void>;

export function SelectDashboardFile():Promise<string>;

export function SelectDirectory():Promise<string>;

export function SelectLegacyDashboardFile():Promise<string>;

export function TestConnection(arg1:string,arg2:string,arg3:string):Promise<smartermail.RequestStats>;

export function Unload():Promise<void>;

export function Update():Promise<void>;

export function VerifyLegacy(arg1:string,arg2:string):Promise<number>;
