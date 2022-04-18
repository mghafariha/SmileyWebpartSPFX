import * as React from 'react';
import * as moment from 'moment';
import styles from './SmileyFace.module.scss';
import { ProgressIndicator } from 'office-ui-fabric-react/lib/ProgressIndicator';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import "@pnp/sp/profiles";
import "@pnp/sp/site-users/web";

import { IUser } from '../entities/IUser';
import { findLastIndex } from 'lodash';
import ProgressBar from "./ProgressBar";
export interface IStatisticalChartProps {
  description: string;
  context: string;
}
export interface IStatisticalChartState {
  countAllData: number;
  verySadCount: number;
  sadCount: number;
  okeyCount: number;
  happyCount: number;
  veryHappyCount: number;
  currentUser: IUser;
  isLoading: boolean;
}
const verySadPic: any = require('../images/VerySad.png');
const sadPic: any = require('../images/Sad.png');
const okeyPic: any = require('../images/Okey.png');
const happyPic: any = require('../images/Happy.png');
const veryHappyPic: any = require('../images/VeryHappy.png');
export default class StatisticalChart extends React.Component<IStatisticalChartProps, IStatisticalChartState>{
  constructor(props: IStatisticalChartProps, state: IStatisticalChartState) {
    super(props);
    this.state = {
      currentUser: { name: '', id: 0, email: '', loginName: '' },
      countAllData: 0,
      verySadCount: 0,
      sadCount: 0,
      okeyCount: 0,
      happyCount: 0,
      veryHappyCount: 0,
      isLoading: true
    }

  }
  public async componentDidMount() {
    // const weekNumber=new Date().getUTCFullYear().toString()+"-"+ (new Date().getUTCMonth()+1).toString()+"-"+this.getWeekOfMonth(new Date());
    const userResult = await sp.web.currentUser.get();
    console.log('user', userResult);
    this.setState({ ...this.state, currentUser: { name: userResult['Title'], id: userResult['Id'], email: userResult["Email"], loginName: userResult["LoginName"] } });
    //const result=await pnp.sp.web.lists.getByTitle("UserDailyExpressions").items.select("Id","Author","Author/Id","Created","Expression").filter(`(AuthorId eq ${userResult['Id']}) and (WeekNumber eq '${weekNumber}')`).expand("Author").get();
    const result = await sp.web.lists.getByTitle("UserDailyExpressions").items.select("Id", "Expression").top(5000).get();
    console.log('countAll', result.length);
    this.setState({
      ...this.state, countAllData: result.length, verySadCount: result.filter(a => a.Expression == 'verySad').length,

      sadCount: result.filter(a => a.Expression == 'sad').length,

      okeyCount: result.filter(a => a.Expression == 'okey').length,
      happyCount: result.filter(a => a.Expression == 'happy').length,

      veryHappyCount: result.filter(a => a.Expression == 'veryHappy').length
    })
    this.setState({ ...this.state, isLoading: false });
  }
  private getWeekOfMonth = (date) => {
    let weeks = moment(date).weeks() - moment(date).startOf('month').weeks() + 1;
    weeks = (weeks + 52) % 52;
    console.log('week', weeks);
    return weeks;
  }
  public render(): React.ReactElement<IStatisticalChartProps> {

    return (

      (!this.state.isLoading) && <div className={styles.emojiShortView}>
        <div className={styles.questionTitle}>How it's going this week</div>

        <div className={styles.barChart}>
          <div style={{ flex: 0 }}>
            <img style={{ flex: 0 }} src={veryHappyPic} alt="my image" width="30" />
          </div>
          <div className={styles.progressBar}>
            <ProgressBar completed={this.state.countAllData ? (Math.floor((this.state.veryHappyCount * 100) / (this.state.countAllData))) : 0} />
          </div>
          <div style={{ flex: 0, marginLeft: '1%', marginTop: '1%', fontWeight: 'bold' }}>
            {Math.floor((this.state.veryHappyCount * 100) / (this.state.countAllData) || 0)}%
          </div>
        </div>


        <div className={styles.barChart}>
          <div style={{ flex: 0 }}>
            <img style={{ flex: 0 }} src={happyPic} alt="my image" width="30" />
          </div>
          <div className={styles.progressBar}>
            <ProgressBar completed={Math.floor((this.state.happyCount * 100) / (this.state.countAllData))} />
          </div>
          <div style={{ flex: 0, marginTop: '1%', fontWeight: 'bold' }}>
            {Math.floor((this.state.happyCount * 100) / (this.state.countAllData))}%
          </div>
        </div>

        <div className={styles.barChart}>
          <div style={{ flex: 0 }}>
            <img style={{ flex: 0 }} src={okeyPic} alt="my image" width="30" />
          </div>
          <div className={styles.progressBar}>
            <ProgressBar completed={Math.floor((this.state.okeyCount * 100) / (this.state.countAllData))} />
          </div>
          <div style={{ flex: 0, marginTop: '1%', fontWeight: 'bold' }}>
            {Math.floor(((this.state.okeyCount * 100) / (this.state.countAllData)) || 0)}%
          </div>
        </div>

        <div className={styles.barChart}>
          <div style={{ flex: 0 }}>
            <img style={{ flex: 0 }} src={sadPic} alt="my image" width="30" />
          </div>
          <div className={styles.progressBar}>
            <ProgressBar completed={Math.floor((this.state.sadCount * 100) / (this.state.countAllData))} />
          </div>
          <div style={{ flex: 0, marginTop: '1%', fontWeight: 'bold' }}>
            {Math.floor((this.state.sadCount * 100) / (this.state.countAllData))}%
          </div>
        </div>
        <div className={styles.barChart}>
          <div style={{ flex: 0 }}>
            <img style={{ flex: 0 }} src={verySadPic} alt="my image" width="30" />
          </div>
          <div className={styles.progressBar}>
            <ProgressBar completed={Math.floor((this.state.verySadCount * 100) / (this.state.countAllData))} />
          </div>
          <div style={{ flex: 0, marginTop: '1%', fontWeight: 'bold' }}>
            {Math.floor((this.state.verySadCount * 100) / (this.state.countAllData))}%
          </div>
        </div>
      </div>


    )
  }

}