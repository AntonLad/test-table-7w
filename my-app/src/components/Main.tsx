import React from 'react'
import Header from './Header'
import Navigation from './Navigation'
import TableMain from './TableMain';


const Main = () => {
  return (
    <>
      <Header />
      <div className="mainWrapper">
        <Navigation />
        <TableMain />
      </div>
    </>
  )
}
export default Main