import { ICustomTemplateFieldValue } from '../../models/ICustomTemplateFieldValue';
import { IRenderer } from '../../models/IRenderer';
import { ISearchResults } from '../../models/ISearchResult';
import { RendererType } from '../../models/RendererType';

export default interface ISearchResultsRendererService {
  /**
   * The current results
   */
  results: ISearchResults;

  /**
   * Indicates if results are loading
   */
  IsLoading: boolean;

  /**
   * Persists the results to the local storage and fires an update event.
   * @param results The new results
   * @param rendererId The Id of the custom action chosen to render the resultdata.
   * @param mountNode The name of the html node which the renderers should use to display the results
   */
  updateResultData(
    results: ISearchResults,
    rendererId: string,
    mountNode: string,
    customTemplateFieldValues?: ICustomTemplateFieldValue[],
  ): void;

  /**
   * Registerer the renderer as an renderer to be picked up by the search-refiners webpart.
   * @param rendererId The id of the renderer
   * @param rendererName The name that should be displayed in the search-refiners webpart
   * @param rendererIcon The office-ui-fabric icon to be displayed.
   * @param rendererType The type of renderer being register.
   * @param callback The function that should run whenever the renderer recieves data.
   * @param requiredSelectProperties The properties that are required to be returned from the search service for this renderer
   * @param customFields any field mappings that are required for the renderer.
   */
  registerRenderer(
    rendererId: string,
    rendererName: string,
    rendererIcon: string,
    rendererType: RendererType,
    callback: (e: any) => void,
    requiredSelectProperties?: string[],
    customFields?: string[],
  ): void;

  /**
   * Get all registered renderers on the current page.
   */
  getRegisteredRenderers(rendererType: RendererType): IRenderer[] | undefined;
}
