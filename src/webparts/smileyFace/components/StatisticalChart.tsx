import * as React from 'react';
import * as moment from 'moment';
import styles from './SmileyFace.module.scss';
import {ProgressIndicator}  from 'office-ui-fabric-react/lib/ProgressIndicator'; 
import {Fabric} from 'office-ui-fabric-react/lib/Fabric';
import pnp from "sp-pnp-js"; 
import CurrentUser  from "sp-pnp-js";

import {IUser} from '../entities/IUser';
import { findLastIndex } from 'lodash';
import ProgressBar from "./ProgressBar";
 export interface IStatisticalChartProps{
     description:string;
     context :string;
 }
 export interface IStatisticalChartState{
   verySadCount:number;
   sadCount:number;
   okeyCount:number;
   happyCount:number;
   veryHappyCount:number;
   currentUser :IUser;
}
 const verySadPic: any = require('../images/VerySad.png');
 const sadPic: any = require('../images/Sad.png');
 const okeyPic: any = require('../images/Okey.png');
 const happyPic: any = require('../images/Happy.png');
 const veryHappyPic: any = require('../images/VeryHappy.png');
export default class StatisticalChart extends React.Component<IStatisticalChartProps,IStatisticalChartState>{
    constructor(props:IStatisticalChartProps , state:IStatisticalChartState) { 
        super(props);  
        this.state = {
         currentUser:{name:'',id:0,email:''} ,  
        verySadCount:0,
        sadCount:0,
        okeyCount:0,
        happyCount:0,
        veryHappyCount:0
        }
        
      }
    public async componentDidMount(){
        const weekNumber=new Date().getUTCFullYear().toString()+"-"+ (new Date().getUTCMonth()+1).toString()+"-"+this.getWeekOfMonth(new Date());
       const userResult=await pnp.sp.web.currentUser.get();
        console.log('user',userResult);
          this.setState({...this.state,currentUser:{name:userResult['Title'], id:userResult['Id'],email:userResult["Email"]}});  
 
           const result=await pnp.sp.web.lists.getByTitle("SR1_UserDailyExpressions").items.select("Id","Author","Author/Id","Created","Expression").filter(`(AuthorId eq ${userResult['Id']}) and (WeekNumber eq '${weekNumber}')`).expand("Author").get();
           this.setState({...this.state, verySadCount:result.filter(a=>a.Expression=='verySad').length,
          sadCount:result.filter(a=>a.Expression=='sad').length,

          okeyCount:result.filter(a=>a.Expression=='okey').length,
           happyCount:result.filter(a=>a.Expression=='happy').length,
         
           veryHappyCount:result.filter(a=>a.Expression=='veryHappy').length
          })
        }
        private getWeekOfMonth=(date)=> {
          let weeks = moment(date).weeks() - moment(date).startOf('month').weeks() + 1;
           weeks = (weeks + 52) % 52;
           console.log('week',weeks);
           return weeks;
      }
public render() : React.ReactElement<IStatisticalChartProps>{

    return (
      <div className={styles.emojiShortView}>
          <div className={styles.questionTitle}>How it's going this week</div>
          
           <div className={styles.barChart}>
             <div style={{flex:0}}>
               <img style={{flex:0}}src={veryHappyPic} alt="my image"  width="30" />
             </div>
           <div className={styles.progressBar}>
           <ProgressBar  completed={Math.floor((this.state.veryHappyCount*100)/7 )} />
                </div>
                <div style={{flex:0,marginLeft:'1%',marginTop:'1%',fontWeight:'bold'}}>
                  {Math.floor((this.state.veryHappyCount*100)/7 )}%
                  </div>
                </div>
        

          <div className={styles.barChart}>
             <div style={{flex:0}}>
               <img style={{flex:0}}src={happyPic} alt="my image"  width="30" />
             </div>
           <div className={styles.progressBar}>
           <ProgressBar  completed={Math.floor((this.state.happyCount*100)/7 )} />
                </div>
                <div style={{flex:0,marginTop:'1%',fontWeight:'bold'}}>
                  {Math.floor((this.state.happyCount*100)/7 )}%
                  </div>
                </div>
           
                <div className={styles.barChart}>
             <div style={{flex:0}}>
               <img style={{flex:0}}src={okeyPic} alt="my image"  width="30" />
             </div>
           <div className={styles.progressBar}>
           <ProgressBar  completed={Math.floor((this.state.okeyCount*100)/7 )} />
                </div>
                <div style={{flex:0,marginTop:'1%',fontWeight:'bold'}}>
                  {Math.floor((this.state.okeyCount*100)/7 )}%
                  </div>
                </div>
            
                <div className={styles.barChart}>
             <div style={{flex:0}}>
               <img style={{flex:0}}src={sadPic} alt="my image"  width="30" />
             </div>
           <div className={styles.progressBar}>
           <ProgressBar  completed={Math.floor((this.state.sadCount*100)/7 )} />
                </div>
                <div style={{flex:0,marginTop:'1%',fontWeight:'bold'}}>
                  {Math.floor((this.state.sadCount*100)/7 )}%
                  </div>
                </div>

                

                <div className={styles.barChart}>
             <div style={{flex:0}}>
               <img style={{flex:0}}src={verySadPic} alt="my image"  width="30" />
             </div>
           <div className={styles.progressBar}>
           <ProgressBar  completed={Math.floor((this.state.verySadCount*100)/7 )} />
                </div>
                <div style={{flex:0,marginTop:'1%',fontWeight:'bold'}}>
                  {Math.floor((this.state.verySadCount*100)/7 )}%
                  </div>
                </div>

                
            
          </div>
            
         
    )
}

}