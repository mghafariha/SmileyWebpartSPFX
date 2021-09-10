import * as React from 'react';
import styles from './SmileyFace.module.scss';
import * as moment from 'moment';
import { ISmileyFaceProps } from '../entities/ISmileyFaceProps';
import { ISmileyFaceState } from '../entities/ISmileyFaceState';
import SmileyFaceSubmit from '../components/SmileyFaceSubmit';
import StatisticalChart from '../components/StatisticalChart';
import { Web } from "sp-pnp-js";
import CurrentUser  from "sp-pnp-js";
import {IUser} from '../entities/IUser';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';
import pnp from "sp-pnp-js"; 
import { thProperties } from '@uifabric/utilities';

export default class SmileyFace extends React.Component<ISmileyFaceProps, ISmileyFaceState> {
  
  
  constructor(props: ISmileyFaceProps, state:ISmileyFaceState) { 
              super(props);  

              this.state = {  
                status: 'submit',  
                items: [],
                currentUser:{name:'',id:0,email:''} ,
                 hasUserData:false,
                 isLoading:true
              }; 
            }

            public async componentDidMount(){

              const weekNumber=new Date().getUTCFullYear().toString()+"-"+ new Date().getUTCMonth().toString()+"-"+this.getWeekOfMonth(new Date());
             const userResult=await pnp.sp.web.currentUser.get();
          
                this.setState({...this.state,currentUser:{name:userResult['Title'], id:userResult['Id'],email:userResult["Email"]}});  
               
               var today = new Date();
               var nextday  = moment(today).add(1,'days');
              
               const todayStr = moment(today).format("YYYY-MM-DD");
               var currentDate = todayStr+'T00:00:00.000Z';
               
               const nextdayStr = moment(nextday).format("YYYY-MM-DD");
               var nextDate = nextdayStr+'T00:00:00.000Z';
                // const result=await sp.web.lists.getByTitle("UserDailyExpressions").items.select("Id","Author","Author/Id","Created").filter(`(AuthorId eq ${userResult['Id']}) and (Date ge datetime'${currentDate}') and (Date le datetime'${nextDate}')`).expand("Author").get();
                 const result=await pnp.sp.web.lists.getByTitle("UserDailyExpressions").items.select("Id","Author","Author/Id","Created").filter(`(AuthorId eq ${userResult['Id']}) and (Created ge datetime'${currentDate}') and (Created le datetime'${nextDate}') `).expand("Author").get();
                 this.setState({...this.state,isLoading:false});
                console.log('results',result);
                 if(result.length>0)
                {
                  this.setState({...this.state,hasUserData:true});
                }
                }
            private getWeekOfMonth=(date)=> {
              let weeks = moment(date).weeks() - moment(date).startOf('month').weeks() + 1;
               weeks = (weeks + 52) % 52;
               console.log('week',weeks);
               return weeks;
          }

          private  checkUserHasData=(hasData:boolean)=>{
            this.setState({...this.state,hasUserData:hasData});
          };

public render(): React.ReactElement<ISmileyFaceProps> {
    return (
      <div className={styles.smileyFace} >
        <div className={ styles.container }>
          <div className={styles.row} >
            
                {   !this.state.hasUserData  ?
                     <SmileyFaceSubmit {...this.props} getUserHasData={this.checkUserHasData}/>
              :
                    <StatisticalChart {...this.props}/>
                  
                }

          </div>
        </div>
      </div>
    );
  }
}
