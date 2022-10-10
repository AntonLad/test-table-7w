import React, { useEffect, useState } from 'react'
import FolderIcon from '@material-ui/icons/Folder';
import ArchiveIcon from '@material-ui/icons/Archive';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import row from '../icons/row.svg'

export default function Table() {
  const[folder, setFolder] = useState(true)
  const [storage, setStorage] = useState([
    {  
      title: '',
      unit: '',
      quantity: 0,
      unitPrice: 0,
      price: 0,
      parent: 0,
      type: 'level',
      id: 1,
      isEdit: true
    }, 
  ])
  useEffect(() => {
    storage.sort((x, y) => x.parent - y.parent);
  }, [storage])

  interface NewRowData {
    [index: string | number ]: string | number | boolean
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
  function saveRow(rowData: NewRowData, storage: RowData[], type: string, level: string) {
    const index = Math.max(...storage.map((v) => v.id), 0) + 1
    const row: RowData = { ...rowData, 
      title: '',
      unit: '',
      quantity: 0,
      unitPrice: 0,
      price: 0,
      parent: level !== 'sameLevel' ? rowData.id : rowData.parent,
      type: type,
      id: index,
      isEdit: true,
    }
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
      if (currentParentIndex === -1) return changedRows
  
      do {
          const currentParent = rows[currentParentIndex]
          const children = rows.filter((v) => v.parent == currentParent.id)
          const newPrice = children.reduce((acc, v) => acc + v.price, 0)

          if (currentParent.price !== newPrice) {
						rows[currentParentIndex].price = newPrice
		        changedRows.push(rows[currentParentIndex])
		
		        currentParentIndex = rows.findIndex((v) => v.id === currentParent.parent)
						continue
				}
        break
      } while (currentParentIndex !== -1)
      return changedRows
  }

  const handleClickEdit = (row: RowData, storage: RowData[], ind: number ) => {
    const newRow = {
      ...row,
      isEdit: true
    }
    storage.splice(ind, 1, newRow)
    setFolder(!folder)
  }

  const tableData = () => {
    return storage.map((obj, index) => {     
      return (
        <>
          <tr key={obj.id} className="tableRow">
            <td className="columnLevel">
              {obj.type === 'row' 
                  ? <> 
                      <img src={row} alt="row" className="countLine"></img> 
                    </>
                  : folder && obj.type === 'level'
                    ? <> 
                        <AccountTreeIcon onClick={() => {
                          if (!obj.isEdit) {setFolder(!folder)}}
                        }/>
                      </>  
                    :
                      <> 
                        <FolderIcon onClick={() => {
                          if (!obj.isEdit) {
                            setStorage([...storage, saveRow(obj, storage, 'level', 'sameLevel').current])
                          }
                        }}/>
                        <ArchiveIcon onClick={() => {
                          if (!obj.isEdit) {
                            setStorage([...storage, saveRow(obj, storage, 'level', 'nextLevel').current])
                          }
                        }}/>
                        {obj.type === 'level' && (
                          <img src={row} 
                            alt="row" 

                            onClick={() => {
                                if (!obj.isEdit) {
                                  setStorage([...storage, saveRow(obj, storage, 'row', 'line').current])
                                }
                              }}
                          ></img>
                        )}
                      </>
              }  
            </td>
            <td 
              className="columnTitle"
              onDoubleClick={() => handleClickEdit(obj, storage, index)}
            >
              {obj.isEdit  
                ? <input 
                    className={`${obj.id}`} 
                    name="title"
                    defaultValue={obj.title}
                    onKeyPress={(ev) => {
                      if (ev.key === 'Enter') {
                        editRow(obj, storage, obj.id, obj.type)
                      }
                    }}
                  />
                : obj.title
              }
            </td>

            <td 
              className="columnData"
              onDoubleClick={() => handleClickEdit(obj, storage, index)}
            >
              {obj.isEdit && (obj.type === 'row') 
                ? <input name="unit"
                    className={`${obj.id}`}
                    defaultValue={obj.unit}
                    onKeyPress={(ev) => {
                      if (ev.key === 'Enter') {
                        editRow(obj, storage, obj.id, obj.type)
                      }
                    }}
                  /> 
                : obj.type === 'level' ? '' : obj.unit
              }
            </td>

            <td
              className="columnData" 
              onDoubleClick={() => handleClickEdit(obj, storage, index)}
            >
              {obj.isEdit && (obj.type === 'row') 
                ? <input name="quantity"
                    className={`${obj.id}`}
                    defaultValue={obj.quantity}
                    onKeyPress={(ev) => {
                      if (ev.key === 'Enter') {
                        editRow(obj, storage, obj.id, obj.type)
                      }
                    }}
                  /> 
                : obj.type === 'level' ? '' : obj.quantity
              }
            </td>

            <td 
              className="columnData" 
              onDoubleClick={() => handleClickEdit(obj, storage, index)}  
            >
              {obj.isEdit && (obj.type === 'row') 
                ? <input name="unitPrice"
                    className={`${obj.id}`}
                    defaultValue={obj.unitPrice}
                    onKeyPress={(ev) => {
                      if (ev.key === 'Enter') {
                        editRow(obj, storage, obj.id, obj.type)
                      }
                    }}
                  /> 
                : obj.type === 'level' ? '' : obj.unitPrice
              }
            </td>
            <td  className="columnData">{obj.price}</td>
          </tr>
        </>
      )
    })  
  }
  
  return (
    <div>
      <table>
        <thead>
          <tr className="caption">
            <th>Уровень</th>
            <th>Наименование работ</th>
            <th>Ед. изм.</th>
            <th>Количество</th>
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
