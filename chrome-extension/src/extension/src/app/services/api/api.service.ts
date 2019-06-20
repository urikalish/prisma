import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import "rxjs/add/operator/retry";
import "rxjs/add/observable/throw";
import {isNullOrUndefined} from "util";
import {DateQueryValues} from "../state/state.service";
import {HttpObserve} from "@angular/common/http/src/client";

const SEARCH_EVENTS_API = "/api/selectors/search";
const GET_FILTERS_API = "/api/filters";
const CHECK_HEALTH_API = "/management/health";

@Injectable()
export class ApiService {
  private _baseURL: string;

  constructor(private http: HttpClient) {
  }

  set baseURL(value: string) {
    this._baseURL = value;
  }

  get baseURL(): string {
    return this._baseURL;
  }

  public checkConnectivity(url): Observable<HealthResponse> {
    return this.get<HealthResponse>(`${url}${CHECK_HEALTH_API}`)
      .do(res => {
        return res['status'] === 'UP' ? res : Observable.throw('PRiSMA server is down');
      })
      .retry(3);
  }

  public getEvents(filters?: QueryFilters, dateFilter?: string, isClickable?: boolean): Observable<GetEventsResponse> {
    let url = `${this.baseURL}${SEARCH_EVENTS_API}?size=5000`;

    let body: QueryBuilder = {
      filters: filters,
      fromTime: '',
      toTime: ''
    };

    if (!isNullOrUndefined(dateFilter)) {
      body.toTime = `${DateQueryValues.NOW}`;
      body.fromTime = `${dateFilter}`;
    }

    if (isClickable === true) {
      url = `${url}&isOnlyClickable=true`;
    }

    return this.post<GetEventsResponse>(url, body);
  }

  public getFilters() {
    return this.get(`${this.baseURL}${GET_FILTERS_API}`);
  }

  public getFilterValues(filters: any, filter: string) {
    return this.post(`${this.baseURL}${GET_FILTERS_API}/${filter}?size=5000`, filters);
  }

  private get<T>(url: string, options?: HttpOptions): Observable<T> {
    // return this.http
    //   .get(url, {params: search})
    //   // .map((res: Response) => res)
    //   .catch(this.handleError)
    //   .retry(3);

    return this.request<T>(HttpRequestType.GET, url, options)
      .catch(this.handleError);
  }

  private post<T>(url: string, body: any = {}, options: HttpOptions = {}): Observable<T> {
    return this.request<T>(HttpRequestType.POST, url, options, body)
      .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    console.warn('ApiService::handleError', error);
    return Observable.throw(error);
  }

  private request<T>(method: HttpRequestType, url: string, options: HttpOptions = {}, body?: any): Observable<T> {
    if (!isNullOrUndefined(body)) {
      options['body'] = body;
    }

    return this.http.request(method, url, options);
  }
}

export interface QueryFilters {
  [propName: string]: Array<any>
}

export interface QueryBuilder {
  filters: QueryFilters
  fromTime: string,
  toTime: string
}

export interface GetEventsResponse {
  [key: string]: GetEventsSelector
}

export interface GetEventsSelector {
  count: number,
  weight: number,
  tags: Array<string>
}

// From https://angular.io/api/common/http/HttpClient
export interface HttpOptions {
  body?: any,
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe?: HttpObserve;
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  withCredentials?: boolean;
}

interface HealthResponse {
  status: string
}

export enum HttpRequestType {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete'
}
