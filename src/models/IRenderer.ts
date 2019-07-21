import { RendererType } from './RendererType';

export interface IRenderer {
  id: string;
  name: string;
  icon: string;
  type: RendererType;
  selectProperties?: string[];
  customFields?: string[];
}
