import React from 'react'
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import ReplyIcon from '@material-ui/icons/Reply';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import MoodIcon from '@material-ui/icons/Mood';

const Header = () => {
  return (
    <div className="header">
      <div className="headerWrapper">
        <ViewComfyIcon />
        <ReplyIcon />
        <div>Просмотр</div>
        <div>Управление</div>
      </div>
      <div className="headerWrapper right"> 
        <MoodIcon />
        <div>Антон Петров</div>
        <KeyboardArrowDownIcon />
      </div>

    </div>

  )
}
export default Header