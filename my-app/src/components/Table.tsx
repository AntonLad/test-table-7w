import React, { useState } from 'react'
import DescriptionIcon from '@material-ui/icons/Description';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import FolderIcon from '@material-ui/icons/Folder';
import ArchiveIcon from '@material-ui/icons/Archive';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import AccountTreeIcon from '@material-ui/icons/AccountTree';





export default function Table() {
  const[folder, setFolder] = useState(true)
  const [storage, setStorage] = useState([
    {  
        title: 'Южная компания',
        unit: '',
        quantity: 0,
        unitPrice: 0,
        price: 0,
        parent: null,
        type: 'level',
        id: 1,
        isEdit: false
      }, 
    ])
    console.log('STORAGE1' , storage)

    interface NewRowData {
      title: string // Наименование работ
      unit: string // Ед. изм.
      quantity: number // Количество
      unitPrice: number // Цена за ед.
      price: number // Стоимость
  
      parent: number | null | any // id уровня, в котором находится (либо null для первого уровня)
      type: string
      
      isEdit: boolean
      id: number
  }
  
  interface RowData extends NewRowData {
      id: number
  }
  
  // функция для сохранения строки
  function saveRow(rowData: NewRowData, storage: RowData[], type: string) {
      const index = Math.max(...storage.map((v) => v.id), 0) + 1
      const row: RowData = { ...rowData, 
        title: '',
        unit: '',
        quantity: 0,
        unitPrice: 0,
        price: 0,
        parent: rowData.id,
        type: type,
        id: index,
        isEdit: true,
     }
  
      console.log('ROW', row)
      console.log('recalculation', recalculation(row.parent, storage))

      return {
          current: row,
          changed: recalculation(row.parent, storage)
      }
  }
  
  // функция для изменения строки
  function editRow(row: RowData, storage: RowData[], idObj: number, type: string) {
      const index = storage.findIndex((v) => v.id === row.id)
      const elem = document.getElementsByClassName(`${idObj}`)
      const title = (elem[0] as HTMLInputElement).value
      const unit = type === 'row' ? (elem[1] as HTMLInputElement).value : '' 
      const quantity = type === 'row' ? (elem[2] as HTMLInputElement).value : 0
      const unitPrice = type === 'row' ? (elem[3] as HTMLInputElement).value : 0
      const newRow = {
        ...row,
        title: title,
        unit: unit,
        quantity: +quantity, 
        unitPrice: +unitPrice,
        price: +quantity * +unitPrice,
        isEdit: false
      }
      
      storage.splice(index, 1, newRow)
      setStorage(storage)
      console.log('CHANGED EDIT', recalculation(row.parent, storage))
      setFolder(!folder)
      return {
          current: newRow,
          changed: recalculation(row.parent, storage)
      }
  }
  
  function recalculation(parentID: number | null, storage: RowData[]) {
      const rows = [...storage]
      const changedRows: RowData[] = []
      
      if (parentID == null) return changedRows
      let currentParentIndex = rows.findIndex((v) => v.id === parentID)
      // console.log('currentParentIndex', currentParentIndex)
      if (currentParentIndex === -1) return changedRows
      // let currentParent = rows[currentParentIndex]
      // console.log('currentParent', currentParent)
  
      do {
          const currentParent = rows[currentParentIndex]
          // console.log('currentParent', currentParent)
          const children = rows.filter((v) => v.parent == currentParent.id)
          // console.log('chidren', children)
          const newPrice = children.reduce((acc, v) => acc + v.price, 0)
          // console.log('current price', currentParent.price)
          // console.log('newPrice', newPrice  )

          if (currentParent.price !== newPrice) {
						rows[currentParentIndex].price = newPrice
		        changedRows.push(rows[currentParentIndex])
		
		        currentParentIndex = rows.findIndex((v) => v.id === currentParent.parent)
						continue
				}
        // console.log('currentParentIndex22', currentParentIndex)
        break
      } while (currentParentIndex !== -1)
      // console.log('changedRows', changedRows)
      return changedRows
  }

  const tableData = () => {
    return storage.map((obj, index) => {
      type nameTdType = {
        [index: string]: string
        0: string
        1: string
        2: string
      }
      const tdArray = [obj.unit, obj.quantity, obj.unitPrice]
      const nameTd: nameTdType = {0: 'unit', 1: 'quantity', 2: 'unitPrice'}      
      return (
        <tr key={obj.id}>
          <td>
            {obj.type === 'row' 
                ? <>
                    <InsertDriveFileIcon />
                    {obj.parent}
                  </>
                : folder && obj.type === 'level'
                  ? <AccountTreeIcon onClick={() => setFolder(!folder)} />
                  :
                    <> 
                      <FolderIcon onClick={() => {
                        // saveRowLevel(obj, storage);
                        setFolder(!folder)
                      }}/>
                      <ArchiveIcon onClick={() => {
                        setStorage([...storage, saveRow(obj, storage, 'level').current])
                        // setFolder(!folder)
                      }}
                      
                      />
                      {obj.type === 'level' && (
                        <DescriptionIcon onClick={() => {
                          setStorage([...storage, saveRow(obj, storage, 'row').current])
                          // setFolder(!folder)
                        }}/>
                      )}
                      {obj.parent}
                    </>
            }  
          </td>
          <td   
            // onDoubleClick={() => handleClickEdit(obj, storage, index)}
          >
            {obj.isEdit  
              ? <input 
                  className={`${obj.id}`} 
                  name="title"
                  onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                      editRow(obj, storage, obj.id, obj.type)
                    }
                  }}
                  // onChange={e => {handleChange(e)}} 
                />
              : obj.title
            }
          </td>

          {tdArray.map((it, ind) => {
            return (
              <td
                key={ind}
                // onDoubleClick={() => handleClickEdit(obj, storage, index)}
              >
                {obj.isEdit && (obj.type === 'row') 
                  ? <input name={nameTd[ind]}
                      className={`${obj.id}`}
                      // onChange={e => {handleChange(e)}}
                      onKeyPress={(ev) => {
                        if (ev.key === 'Enter') {
                          editRow(obj, storage, obj.id, obj.type)
                        }
                      }}
                    /> 
                  : obj.type === 'level' ? '' : it
                }
              </td>
            ) 
          })}
          <td>{obj.price}</td>
        </tr>
      )
    })  
  }
  
  return (
    <div>
      <table style={{ width: '700px'}}>
      <caption></caption>
        <thead>
          <tr>
            <th>Уровень</th>
            <th>Наименование работ</th>
            <th>Ед измерения</th>
            <th>Колличество</th>
            <th>Цена за ед</th>
            <th>Стоимость</th>
          </tr>
        </thead>
        <tbody>
          {tableData()}
        </tbody>
      </table>   
    </div>  
  )
}



        