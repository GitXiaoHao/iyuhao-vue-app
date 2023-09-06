
export interface OptionsType {
    extHeight: number,
    showIndex: boolean,
    stripe: boolean,
    border: boolean,
    selectType: String
}

export interface ColumnType {
    prop: string,
    label: string,
    align?: string,
    width?: number
    fixed?:Boolean | String
    scopedSlots?: boolean | string
}


export interface DataSourceType<T> {
    records: Array<T>,
    total: number
    size: number
    current: number
}


export interface PropsType<T> {
    dataSource: DataSourceType<T>,
    showPagination: boolean
    options: OptionsType
    columns: ColumnType[]
    fetch: Function
    initFetch: boolean
}