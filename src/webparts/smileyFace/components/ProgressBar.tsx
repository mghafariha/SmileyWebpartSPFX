import * as React from 'react';
import styles from './SmileyFace.module.scss';
export interface IProgressBarProps{
    completed:number;
   
}
export default class ProgressBar extends React.Component<IProgressBarProps> {
  

    

  public render(): React.ReactElement<IProgressBarProps> {
    return (
        <div className={styles.containerProgress}>
        <div className={styles.fillerProgress} style={{width:`${this.props.completed}%`}}>
          <span
              className={styles.labelProgress}>
                 {`${this.props.completed}%`}
             
        </span>
        </div>
      </div>
  );
    }
};

