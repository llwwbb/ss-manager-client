import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
interface addBody {
  server_port: number,
  password: string,
  fast_open?: boolean,
  no_delay?: boolean,
  mode?: string,
  method?: string,
  plugin?: string,
  plugin_opts?: string,
}
const host = environment.host;
const ssUrl = `${host}/ss`;
const pingUrl = `${host}/ping`;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  server_port: number;
  password: string = '';
  fast_open: boolean = false;
  no_delay: boolean = false;
  mode: string = '';
  method: string = '';
  plugin: string = '';
  plugin_opts: string = '';
  listArr: Array<addBody>;
  resultMsg: string;
  token: string;
  constructor(public http: HttpClient) {

  }
  list() {
    this.listArr = [];
    this.http.get<Array<addBody>>(ssUrl, {headers: {token: this.token}}).subscribe((d) => {
      this.listArr = d;
      console.log(d)
    })
  }

  itemClick(i: number) {
    let item = this.listArr[i];
    this.server_port = item.server_port;
    this.password = item.password;
    this.method = item.method;
  }

  add() {
    this.resultMsg = '';
    let data: addBody = { server_port: this.server_port, password: this.password };
    if (this.method != null && this.method.length > 0) data.method = this.method;
    if (this.fast_open === true) data.fast_open = this.fast_open;
    if (this.no_delay === true) data.no_delay = this.no_delay;
    if (this.mode != null && this.mode.length > 0) data.mode = this.mode;
    if (this.plugin != null && this.plugin.length > 0) data.plugin = this.plugin;
    if (this.plugin_opts != null && this.plugin_opts.length > 0) data.plugin_opts = this.plugin_opts;
    this.http.put(ssUrl, data, { responseType: 'text', headers: {token: this.token} }).subscribe((r) => {
      this.resultMsg = r;
    });
  }

  delete() {
    this.resultMsg = '';
    this.http.delete(`${ssUrl}/${this.server_port}`, { responseType: 'text', headers: {token: this.token} }).subscribe(r => {
      this.resultMsg = r;
    });
  }

  ping() {
    this.http.get(pingUrl, { responseType: 'text', headers: {token: this.token} }).subscribe(r => {
      this.resultMsg = r;
    })
  }
}
