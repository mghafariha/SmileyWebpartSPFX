import * as React from 'react';
import * as moment from 'moment';
import styles from './SmileyFace.module.scss';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import "@pnp/sp/profiles";
import "@pnp/sp/site-users/web";
import { Web } from "@pnp/sp/webs";
import { IUser } from '../entities/IUser';
export interface IThankYouProps {
    description: string;
    thankYouText: string;
}

export default class ThankYou extends React.Component<IThankYouProps, any>{

    constructor(props: IThankYouProps, state: any) {
        super(props);

    }

    public componentDidMount() {


    }

    public render(): React.ReactElement<IThankYouProps> {

        return (
            <div className={styles.thankYouCard}>
                <div className={styles.thankYouTitle}>{this.props.thankYouText} </div>

            </div>



        )
    }

}