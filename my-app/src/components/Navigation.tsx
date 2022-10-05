import React from 'react'
import DashboardRoundedIcon from '@material-ui/icons/DashboardRounded';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const Navigation = () => {
  const navigateData = {
    project: 'По проекту',
    objects: 'Объекты',
    rd: 'РД',
    mto: 'МТО',
    smp: 'СМР',
    graf: 'График',
    mim: 'МиМ',
    workers: 'Рабочие',
    capital: 'Капиталовложения',
    budget: 'Бюджет',
    finance: 'Финансирование',
    panoramas: 'Панорамы',
    cameras: 'Камеры',
    assignments: 'Поручения',
    counterparties: 'Контрагенты'
  }  

  return (
    <>
      <div className="navigateWrapper">
        <div className="navigateTitle">
          <div className="navigateTitleWrapper">
            <div>Название проекта</div>
            <span className="navigateTitleSpan">Аббревиатура</span>
          </div>
          <KeyboardArrowDownIcon />
        </div>
        {Object.values(navigateData).map((it, ind) => {
          return (
            <div key={ind} className="navigateItem">
              <div className="navigateItemWrapper">              
                <DashboardRoundedIcon fontSize="small"/>
                <span className="navigateItemSpan">{it}</span> 
              </div>

            </div>
          )
        })}
      </div>

    </>

  )
}
export default Navigation