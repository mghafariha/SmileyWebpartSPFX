import * as React from 'react';
import * as ReactDom from 'react-dom';
import pnp from "sp-pnp-js";
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'SmileyFaceWebPartStrings';
import SmileyFace from './components/SmileyFace';
import { ISmileyFaceProps } from './entities/ISmileyFaceProps';
import { SPComponentLoader } from '@microsoft/sp-loader';
export interface ISmileyFaceWebPartProps {
  description: string;
  cssUrl:string;
}

export default class SmileyFaceWebPart extends BaseClientSideWebPart<ISmileyFaceWebPartProps> {
  
  public render(): void {
    const element: React.ReactElement<ISmileyFaceProps > = React.createElement(
      SmileyFace,
      {
        description: this.properties.description,
        context:this.context.pageContext.web.title,
         web:this.context.pageContext.site.absoluteUrl
        
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
 
  
    
    protected async onInit(): Promise<void> {
      console.log('site',this.context.pageContext.site.absoluteUrl +this.properties.cssUrl);
    SPComponentLoader.loadCss(this.context.pageContext.site.absoluteUrl +this.properties.cssUrl);
   

      return super.onInit().then(_ => {
          pnp.setup({
            spfxContext: this.context
          })
        
      });
    }
    
   
  
        // inject the style sheet
        // const head: any = document.getElementsByTagName("head")[0] || document.documentElement;
        // let customStyle: HTMLLinkElement = document.createElement("link");
        // customStyle.href = cssUrl;
        // customStyle.rel = "stylesheet";
        // customStyle.type = "text/css";
        // head.insertAdjacentElement("beforeEnd", customStyle);
   
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
            
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('cssUrl', {
                  label: "You can add link of your custom css file",
                  placeholder:'Example : /siteassets/common.css'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
