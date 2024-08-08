/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
/// <library version="0.10.1" src="https://github.com/Insality/druid/archive/master.zip" />

/** @noResolution */
declare module 'druid.druid' {
    let exports: DruidConstructor;
    export = exports;
}

/** @noResolution */
declare module 'druid.styles.default.style' {
    let exports: DruidStyles;
    export = exports;
}

/** @noResolution */
declare module 'druid.extended.data_list' {
}

/** @noResolution */
declare module 'druid.extended.input' {
}

/** @noResolution */
declare module 'druid.extended.layout' {
}


/** @noResolution */
declare module 'druid.custom.rich_input.rich_input' {
}

/** @noResolution */
declare module 'druid.component' {
    export function create(name: string): any;
}

/** @noResolution */
declare module 'druid.custom.rich_text.rich_text' {
}


/** @noResolution */
declare module 'druid.const' {
    export const LAYOUT_MODE: {
        STRETCH: any;
        FIT: any;
        STRETCH_X: any;
        STRETCH_Y: any;
        ZOOM_MIN: any;
        ZOOM_MAX: any;
    };

    export const TEXT_ADJUST: {
        DOWNSCALE: any;
        TRIM: any;
        NO_ADJUST: any;
        DOWNSCALE_LIMITED: any;
        SCROLL: any;
        SCALE_THEN_SCROLL: any;
    };
}


type Context = unknown;
type Callback = (self: Context) => void;
type BtnCallback = (self: Context, params?: any, btn?: any) => void;
type CreateItemFunction = (self: any, data: any, index: number, data_list: any) => [DruidNode, DruidNode?];

interface DruidClass {
    final(): void;
    on_message(message_id: string | hash, message: unknown, sender: string | hash | url): void;
    on_input: (action_id: string | hash, action: unknown) => void;
    update(dt: number): void;
    remove(component: DruidNode): void;
    new_blocker: (node: string) => DruidBlocker;
    new_text: (node: string | any, value?: string, adjust_type?: string) => DruidText;
    new_button: (node: string, cb: BtnCallback) => DruidButton;
    new_checkbox: (node: string, cb: BtnCallback, click_node?: string, init_state?: boolean) => DruidButton;
    new_scroll(scroll: string, container: string): DruidScroll;
    new_static_grid(parent: string, element: string, in_row: number): DruidGridVertical;
    new_data_list(scroll: DruidScroll, grid: DruidGrid, fncCreate: CreateItemFunction): DruidDataList;
    new_input(node: string, text_node_name: string, keyboard_type?: number): DruidInput;
    new: (data: any, name: string) => DruidNode;
    new_layout: (node: string, layout: any) => DruidLayout;
}

/** @noSelf **/
interface DruidConstructor {
    new: (self: Context) => DruidClass;
    set_sound_function: (self: Context) => void;
    set_default_style: (style: any) => void;
    register(name: string, data: any): void;
}

interface DruidLayout extends DruidNode {
    fit_into_node: (node: DruidNode) => void;
}

interface DruidBlocker {
    set_enabled: (state: boolean) => void;
}

interface DruidButton extends DruidNode {
    set_click_zone: (zone: node) => void;
    set_enabled: (state: boolean) => void;
}

interface DruidNode {
    set_input_priority: (val: number) => void;
}

interface DruidRichText extends DruidNode {
    set_text: (text: string) => void;
}

interface DruidText extends DruidNode {
    set_to: (text: string) => void;
    set_color: (color: vmath.vector4) => void;
    set_text_adjust(adjust_type: number, minimal_scale?: number): void;
    node: any;
}

interface DruidScroll extends DruidNode {
    is_animate: any;
    inertion: vmath.vector3;
    set_horizontal_scroll(active: boolean): void;
    set_size(size: vmath.vector3, offset: vmath.vector3): void;
    set_extra_stretch_size(size: number): void;
    scroll_to_percent(percent: vmath.vector3, is_instant?: boolean): void;
    scroll_to(point: vmath.vector3, is_instant?: boolean): void;
    is_inert(): boolean;
    set_inert(val: boolean): void;
    scroll_to_index(index: number, skip_cb?: boolean): void;
    on_scroll_to: { subscribe: any };
}

interface DruidGrid extends DruidNode {
    //set_data: (data: any) => void;
}


interface DruidGridVertical extends DruidGrid {
    add: (node: DruidNode, index: number, is_inst?: boolean) => void;
    clear(): void;
    set_position_function(callback: (node: AnyTable, position: vmath.vector3) => void): DruidGrid;
    nodes: DruidNode[];
}

interface DruidDataList extends DruidNode {
    set_data: (data: any) => void;
    scroll_to_index: (index: number) => void;
    last_index: number;
}


type DruidEvent = (slf: any) => void;


interface DruidInput extends DruidNode {
    get_text: () => string;
    set_text: (text: string) => void;
    on_input_select: { subscribe: any };
    on_input_unselect: { subscribe: any };
    on_input_text: { subscribe: any };
}

interface DruidRichInput extends DruidNode {
    set_placeholder: (text: string) => void;
    cursor: DruidNode;
    druid: DruidNode;
    input: DruidInput;
    placeholder: DruidNode;
}

interface DruidStyles {
    button: {
        LONGTAP_TIME: number;
    }
    scroll: {
        WHEEL_SCROLL_SPEED: number;
    }
}


