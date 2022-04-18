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
export interface ISmileyFaceSubmitProps {
  description: string;
  context: string;
  showChart: boolean;
  siteUrl: string;
  getUserHasData: (boolean) => void;
}
export interface ISmileyFaceItem {
  note: string;
  expression: string;


}

export interface ISmileyFaceSubmitState {

  formItem: ISmileyFaceItem;
  currentUser: IUser;

}

const verySadPic: any = require('../images/VerySad.png');
const sadPic: any = require('../images/Sad.png');
const okeyPic: any = require('../images/Okey.png');
const happyPic: any = require('../images/Happy.png');
const veryHappyPic: any = require('../images/VeryHappy.png');
export default class SmileyFaceSubmit extends React.Component<ISmileyFaceSubmitProps, ISmileyFaceSubmitState>{

  constructor(props: ISmileyFaceSubmitProps, state: ISmileyFaceSubmitState) {
    super(props);

    this.state = {

      formItem: { note: '', expression: '' },

      currentUser: { name: '', id: 0, email: '', loginName: '' },

    };
  }

  public componentDidMount() {

    sp.web.currentUser.get().then((r) => {
      console.log('user', r);
      this.setState({ ...this.state, currentUser: { name: r['Title'], id: r['Id'], email: r["Email"], loginName: r["LoginName"] } });
    });
  }
  private getWeekOfMonth = (date) => {
    let weeks = moment(date).weeks() - moment(date).startOf('month').weeks() + 1;
    weeks = (weeks + 52) % 52;
    console.log('week', weeks);
    return weeks;
  }
  clickSmilyButton(name, e) {
    console.log('name', name);
    this.setState({ ...this.state, formItem: { ...this.state.formItem, expression: name } });
  }

  private getSPData(): void {
    sp.web.currentUser.get().then((r) => {
      console.log('user', r);
      this.setState({ ...this.state, currentUser: { name: r['Title'], id: r['Id'], email: r["Email"], loginName: r["LoginName"] } });
    });
  }


  private clickSubmitButton = async (e) => {

    e.preventDefault();
    const web = Web(`${this.props.siteUrl}`);
    const r = await web();
    console.log('date', new Date);

    console.log('user', this.state.currentUser.name);
    console.log('expression', this.state.formItem.expression);
    const weekNumber = new Date().getUTCFullYear().toString() + "-" + (new Date().getUTCMonth() + 1).toString() + "-" + this.getWeekOfMonth(new Date());
    console.log('weeknumber', weekNumber);
    let item = this.state.formItem;

    web.lists.getByTitle("UserDailyExpressions").items.add({
      Title: moment(new Date()).toISOString().split('T')[0] + " " + this.state.currentUser.name,
      Note: this.state.formItem.note,
      Expression: this.state.formItem.expression,



    }).then((r) => {
      console.log("item id is:", r.data.Id);
      this.props.getUserHasData(true);
    }).catch(error => {
      alert('Item failed to save');
      console.log('error', error);
    })
  }


  public render(): React.ReactElement<ISmileyFaceSubmitProps> {

    return (
      <div className={styles.emojiShortView}>
        <div className={styles.questionTitle}>How's it going today? </div>
        <div className={styles.emojiContainer}>
          <button className={styles.smileyButton + " " + (this.state.formItem.expression != 'veryHappy' && this.state.formItem.expression !== '' ? styles.notSelectedSmileyButton : '')} onClick={e => this.clickSmilyButton('veryHappy', e)} ><img src={veryHappyPic} alt="my image" width="30" /></button>
          <button className={styles.smileyButton + " " + (this.state.formItem.expression != 'happy' && this.state.formItem.expression !== '' ? styles.notSelectedSmileyButton : '')} onClick={e => this.clickSmilyButton('happy', e)}><img src={happyPic} alt="my image" width="30" /></button>
          <button className={styles.smileyButton + " " + (this.state.formItem.expression != 'okey' && this.state.formItem.expression !== '' ? styles.notSelectedSmileyButton : '')} onClick={e => this.clickSmilyButton('okey', e)}><img src={okeyPic} alt="my image" width="30" /></button>
          <button className={styles.smileyButton + " " + (this.state.formItem.expression != 'sad' && this.state.formItem.expression !== '' ? styles.notSelectedSmileyButton : '')} onClick={e => this.clickSmilyButton('sad', e)}><img src={sadPic} alt="my image" width="30" /></button>
          <button className={styles.smileyButton + " " + (this.state.formItem.expression != 'verySad' && this.state.formItem.expression !== '' ? styles.notSelectedSmileyButton : '')} onClick={e => this.clickSmilyButton('verySad', e)}><img src={verySadPic} alt="my image" width="30" /></button>
        </div>

        {this.state != null && this.state.formItem != null && this.state.formItem.expression !== '' && <div>
          <div className={styles.questionSubTitle}>Want to let us know more?</div>
          <div >(Your feedback is anonymous)</div>

          <textarea placeholder='Write your thoughts here, or you can just press submit' className={styles.textarea} rows={8} value={this.state.formItem.note} onChange={e => { this.setState({ ...this.state, formItem: { ...this.state.formItem, note: e.target.value } }) }} />



          <DefaultButton className={styles.submit} onClick={e => this.clickSubmitButton(e)}>Submit</DefaultButton>
        </div>}




      </div>



    )
  }

}