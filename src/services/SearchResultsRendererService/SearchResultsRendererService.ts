import 'custom-event-polyfill';
import { ICustomTemplateFieldValue } from "../../models/ICustomTemplateFieldValue";
import { IRenderer } from "../../models/IRenderer";
import { ISearchEvent } from "../../models/ISearchEvent";
import { ISearchResults } from "../../models/ISearchResult";
import { RendererType } from "../../models/RendererType";
import ISearchResultsRendererService from "./ISearchResultsRendererService";

export default class SearchResultsRendererService implements ISearchResultsRendererService {
  public get results(): ISearchResults { return this._results; }
  public get isLoading(): boolean { return this._isLoading; }
  public set isLoading(status: boolean) { this._isLoading = status; }
  private SEARCH_CHANGED_EVENT_NAME: string = "pnp-spfx-search-changed";
  private SEARCH_RESULT_RENDERERS_OBJECT_NAME: string = "pnp-spfx-search-result-renderers";
  private SEARCH_REFINER_RENDERERS_OBJECT_NAME: string = "pnp-spfx-search-refiner-renderers";
  private SEARCH_VERTICAL_RENDERERS_OBJECT_NAME: string = "pnp-spfx-search-vertical-renderers";
  private SEARCH_PAGINATION_RENDERERS_OBJECT_NAME: string = "pnp-spfx-search-pagination-renderers";
  private _results!: ISearchResults;
  private _isLoading!: boolean;

  public updateResultData(results: ISearchResults, rendererId: string, mountNode: string, customTemplateFieldValues?: ICustomTemplateFieldValue[]) {
    this._results = results;
    const searchEvent: ISearchEvent = new CustomEvent(this.SEARCH_CHANGED_EVENT_NAME);
    searchEvent.rendererId = rendererId;
    searchEvent.results = results;
    searchEvent.mountNode = mountNode;
    searchEvent.customTemplateFieldValues = customTemplateFieldValues;
    window.dispatchEvent(searchEvent);
  }

  public registerRenderer(
    rendererId: string,
    rendererName: string,
    rendererIcon: string,
    rendererType: RendererType,
    callback: (e: ISearchEvent) => void,
    requiredSelectProperties?: string[],
    fields?: string[]
  ): void {
    const newRenderer: IRenderer = {
      customFields: fields,
      icon: rendererIcon,
      id: rendererId,
      name: rendererName,
      selectProperties: requiredSelectProperties,
      type: rendererType,
    };

    switch (rendererType) {
      case RendererType.SearchResults:
        this.setRenderer(this.SEARCH_RESULT_RENDERERS_OBJECT_NAME, newRenderer);
        break;
      case RendererType.SearchRefiners:
        this.setRenderer(this.SEARCH_REFINER_RENDERERS_OBJECT_NAME, newRenderer);
        break;
      case RendererType.SearchVerticals:
        this.setRenderer(this.SEARCH_VERTICAL_RENDERERS_OBJECT_NAME, newRenderer);
        break;
      case RendererType.SearchPagination:
        this.setRenderer(this.SEARCH_PAGINATION_RENDERERS_OBJECT_NAME, newRenderer);
        break;
      default:
        break;
    }

    addEventListener(this.SEARCH_CHANGED_EVENT_NAME, (e: any) => this.handleNewDataRegistered(e, rendererId, callback));
  }

  public getRegisteredRenderers(rendererType: RendererType): IRenderer[] | undefined {
    switch (rendererType) {
      case RendererType.SearchResults:
        return window[this.SEARCH_RESULT_RENDERERS_OBJECT_NAME as keyof typeof window];
      case RendererType.SearchRefiners:
        return window[this.SEARCH_REFINER_RENDERERS_OBJECT_NAME as keyof typeof window];
      case RendererType.SearchVerticals:
        return window[this.SEARCH_VERTICAL_RENDERERS_OBJECT_NAME as keyof typeof window];
      case RendererType.SearchPagination:
        return window[this.SEARCH_PAGINATION_RENDERERS_OBJECT_NAME as keyof typeof window];
      default:
        break;
    }
  }

  private setRenderer(rendererWindowObjectName: string, newRenderer: IRenderer): void {
    if (window[rendererWindowObjectName as keyof typeof window] === undefined) {
      window[rendererWindowObjectName as any] = newRenderer as any;
    }
    else {
      window[rendererWindowObjectName as keyof typeof window].push(newRenderer);
    }
  }

  private handleNewDataRegistered(e: ISearchEvent, rendererId: string | undefined, callback: (e: ISearchEvent) => void) {
    if (callback) {
      if (e.rendererId === rendererId) {
        callback(e);
      }
    }
  }
}
