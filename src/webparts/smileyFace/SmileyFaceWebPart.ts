import * as React from 'react';
import * as ReactDom from 'react-dom';
import { sp } from "@pnp/sp";
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneCheckbox,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SmileyFaceWebPartStrings';
import SmileyFace from './components/SmileyFace';
import { ISmileyFaceProps } from './entities/ISmileyFaceProps';
import { SPComponentLoader } from '@microsoft/sp-loader';
export interface ISmileyFaceWebPartProps {
  description: string;
  siteUrl: string;
  showChart: boolean;
  cssUrl: string;
  thankYouText: string;
}

export default class SmileyFaceWebPart extends BaseClientSideWebPart<ISmileyFaceWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISmileyFaceProps> = React.createElement(
      SmileyFace,
      {
        description: this.properties.description,
        context: this.context.pageContext.web.title,
        web: this.context.pageContext.site.absoluteUrl,
        siteUrl: this.properties.siteUrl,
        showChart: this.properties.showChart,
        thankYouText: this.properties.thankYouText

      }

    );

    ReactDom.render(element, this.domElement);
  }
  protected async onInit(): Promise<void> {
    SPComponentLoader.loadCss(this.properties.cssUrl);
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    });
  }
  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('siteUrl', {
                  label: "Site Url",
                  placeholder: 'Example : /sites/test'
                }),
                PropertyPaneCheckbox('showChart', {
                  text: "Show Chart"
                }),
                PropertyPaneTextField('thankYouText', {
                  label: "Thankyou Text",
                  placeholder: 'Example : Thank You!!'
                }),
                PropertyPaneTextField('cssUrl', {
                  label: "CSS file Url",
                  placeholder: 'Example : /siteassets/common.css'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
