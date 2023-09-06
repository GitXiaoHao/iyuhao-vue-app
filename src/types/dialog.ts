import {ButtonType, DT} from "@/types/blog";


export interface DialogType{
    dialogType: DT
    dialogVisible:Boolean
    title:String
    width?:String
    buttons?: Array<DialogButtonType>

}

export interface DialogButtonType{
    name: String
    type: ButtonType
    click: Function
}