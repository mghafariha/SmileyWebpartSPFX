import * as React from 'react';
import styles from './SmileyFace.module.scss';
import * as moment from 'moment';
import { ISmileyFaceProps } from '../entities/ISmileyFaceProps';
import { ISmileyFaceState } from '../entities/ISmileyFaceState';
import SmileyFaceSubmit from '../components/SmileyFaceSubmit';
import StatisticalChart from '../components/StatisticalChart';
import ThankYou from '../components/ThankYou';

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import "@pnp/sp/profiles";
import "@pnp/sp/site-users/web";
import { Web } from "@pnp/sp/webs";

import { IUser } from '../entities/IUser';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';

import { thProperties } from '@uifabric/utilities';

export default class SmileyFace extends React.Component<ISmileyFaceProps, ISmileyFaceState> {


  constructor(props: ISmileyFaceProps, state: ISmileyFaceState) {
    super(props);

    this.state = {
      status: 'submit',
      items: [],
      currentUser: { name: '', id: 0, email: '', loginName: '' },
      hasUserData: false,
      isLoading: true
    };
  }

  public async componentDidMount() {
    const web = Web(`${this.props.siteUrl}`);
    const r = await web();
    const weekNumber = new Date().getUTCFullYear().toString() + "-" + new Date().getUTCMonth().toString() + "-" + this.getWeekOfMonth(new Date());
    const userResult = await sp.web.currentUser.get();
    console.log('userResult', userResult);
    this.setState({ ...this.state, currentUser: { name: userResult['Title'], id: userResult['Id'], email: userResult["Email"], loginName: userResult["LoginName"] } });

    var today = new Date();
    var nextday = moment(today).add(1, 'days');

    const todayStr = moment(today).format("YYYY-MM-DD");
    var currentDate = todayStr + 'T00:00:00.000Z';

    const nextdayStr = moment(nextday).format("YYYY-MM-DD");
    var nextDate = nextdayStr + 'T00:00:00.000Z';
    // const result=await sp.web.lists.getByTitle("UserDailyExpressions").items.select("Id","Author","Author/Id","Created").filter(`(AuthorId eq ${userResult['Id']}) and (Date ge datetime'${currentDate}') and (Date le datetime'${nextDate}')`).expand("Author").get();
    const result1 = await web.lists.getByTitle("UserDailyExpressions").items.select("Id", "Author/Name", "Author/Id", "Created").filter(` (Created ge datetime'${currentDate}') and (Created le datetime'${nextDate}') `).expand("Author").get();
    const result = await web.lists.getByTitle("UserDailyExpressions").items.select("Id", "Author/Name", "Author/Id", "Created").filter(`(Author/Name eq '${userResult['LoginName']}') and (Created ge datetime'${currentDate}') and (Created le datetime'${nextDate}') `).expand("Author").get();
    this.setState({ ...this.state, isLoading: false });
    console.log('results', result1);
    if (result.length > 0) {
      this.setState({ ...this.state, hasUserData: true });
    }
  }
  private getWeekOfMonth = (date) => {
    let weeks = moment(date).weeks() - moment(date).startOf('month').weeks() + 1;
    weeks = (weeks + 52) % 52;
    console.log('week', weeks);
    return weeks;
  }

  private checkUserHasData = (hasData: boolean) => {
    this.setState({ ...this.state, hasUserData: hasData });
  };

  public render(): React.ReactElement<ISmileyFaceProps> {
    return (
      <div className={styles.smileyFace} >
        <div className={styles.container}>
          <div className={styles.row} >

            {!this.state.hasUserData ?
              <SmileyFaceSubmit {...this.props} getUserHasData={this.checkUserHasData} />
              :
              this.props.showChart ?
                <StatisticalChart {...this.props} />
                :
                <ThankYou {...this.props} />

            }

          </div>
        </div>
      </div>
    );
  }
}
