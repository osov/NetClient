/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as druid from 'druid.druid';
import * as data_list from "druid.extended.data_list";
import { NetMessages } from '../main/game_config';
import { set_text } from '../utils/utils';

interface props {
    druid: DruidClass;
    static_grid: DruidGridVertical;
    scroll: DruidScroll;
    data_list: DruidDataList;
    item_list_grid_component: DruidGridVertical;
}

const KeyCodes = {
    enter: hash('key_enter'),
    backspace: hash('key_backspace'),
    text: hash('text'),
};

interface ProtocolWrapper {
    id: string;
    message: any;
}

function get_uid() {
    let tmp_soc_id = Storage.get_string('tmp_soc_id', '');
    if (tmp_soc_id == '') {
        const id = System.platform + '-' + System.now();
        Storage.set('tmp_soc_id', id);
        tmp_soc_id = id;
    }
    return tmp_soc_id;
}

export function init(_this: props): void {
    msg.post('.', 'acquire_input_focus');
    druid.register("data_list", data_list);
    Manager.init_script();
    _this.druid = druid.new(_this);
    _this.druid.new_button('btnSend', send_text);


    WsClient.connect('ws://localhost:3000');
    EventBus.on('ON_WS_CONNECTED', (e) => {
        log('connected', e);
        let nick = 'test';
        if (System.platform == 'HTML5') {
            nick = html5.run(`new URL(location).searchParams.get('nick')||''`);
        }
        WsClient.send_message('CS_Connect', { nick, id_room: 1, id_session: get_uid(), });
    });

    EventBus.on('ON_WS_DATA', (e) => {
        const data = json.decode(e.data) as ProtocolWrapper;
        on_message_socket(data.id as keyof NetMessages, data.message);
    });

    function on_message_socket<T extends keyof NetMessages>(id_message: T, _message: NetMessages[T]) {
        log('ws data:', id_message, _message);
        if (id_message == 'SC_Chat_Messages') {
            const messages = _message as NetMessages['SC_Chat_Messages'];
            for (let i = 0; i < messages.length; i++) {
                add_message(_this, messages[i]);
            }
        }
        if (id_message == 'SC_Chat_Message') {
            const message = _message as NetMessages['SC_Chat_Message'];
            add_message(_this, message);
        }
    }

    init_chat(_this);
}


let time_scrolled = 0;
function do_scroll(_this: props, req = false) {
    if (System.now() - time_scrolled < 0.2 && !req) {
        return;
    }
    time_scrolled = System.now();
    if (_this.data_list.last_index >= messages.length - 1 || req) {
        _this.data_list.scroll_to_index(messages.length - 1);
    }
}

let last_msg_time = 0;
function add_message(_this: props, msg: NetMessages['SC_Chat_Message'],) {
    messages.push({ ...msg });
    if (messages.length > 10)
        messages.shift();
    _this.data_list.set_data(messages);
    if (System.now() - last_msg_time < 0.2)
        return;
    last_msg_time = System.now();
    do_scroll(_this);
}

let messages: NetMessages['SC_Chat_Message'][] = [];
function create_fnc(_this: props, data: NetMessages['SC_Chat_Message'], index: number, data_list: any) {
    const item = gui.clone_tree(gui.get_node('chat_message'));
    gui.set_text(item['nick'], data.nick);
    gui.set_text(item['text'], data.text);
    return $multi(item['chat_message']);
}

function init_chat(_this: props) {
    const item_node_name = 'chat_message';
    const node_content = 'content';
    _this.scroll = _this.druid.new_scroll('scroll', node_content);
    _this.scroll.set_horizontal_scroll(false);
    _this.static_grid = _this.druid.new_static_grid(node_content, item_node_name, 1);
    _this.data_list = _this.druid.new_data_list(_this.scroll, _this.static_grid, create_fnc);
    _this.data_list.set_data(messages);
    messages = [];
}

function update_input() {
    set_text('input_text', input_text);
}

function send_text() {
    WsClient.send_message('CS_Send_Chat', { text: input_text });
    input_text = '';
    update_input();
}

let input_text = '';
export function on_input(this: props, action_id: string | hash, action: any) {
    this.druid.on_input(action_id, action);
    if (action_id == KeyCodes.backspace && action.repeated) {
        if (string.len(input_text) > 0) {
            input_text = string.sub(input_text, 1, string.len(input_text) - 1);
            update_input();
        }
    }
    else if (action_id == KeyCodes.enter && action.pressed) {
        send_text();
    }
    else if (action_id == KeyCodes.text) {
        input_text += action.text;
        update_input();
    }
}

export function update(this: props, dt: number): void {
    this.druid.update(dt);
}

export function on_message(this: props, message_id: string | hash, message: any, sender: string | hash | url): void {
    this.druid.on_message(message_id, message, sender);
}

export function final(this: props): void {
    Manager.final_script();
    this.druid.final();
}