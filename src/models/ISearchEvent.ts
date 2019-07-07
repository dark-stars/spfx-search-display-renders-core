import { ICustomTemplateFieldValue } from "./ICustomTemplateFieldValue";
import { ISearchResults } from "./ISearchResult";

export interface ISearchEvent extends CustomEvent {
  rendererId?: string;
  results?: ISearchResults;
  mountNode?: string;
  customTemplateFieldValues?: ICustomTemplateFieldValue[];
}
