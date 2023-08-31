import { useEffect, useRef, useState } from 'react'
import './App.css'
import { grid2whole, whole2grid } from './algorithm';
import Draggable, { DraggableCore } from 'react-draggable';
import Popup from 'reactjs-popup';
import {AiOutlineInfoCircle} from "react-icons/ai"

const compareArrays = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

function indexOfAll(array, searchItem) {
  var i = array.indexOf(searchItem),
    indexes = [];
  while (i !== -1) {
    indexes.push(i);
    i = array.indexOf(searchItem, ++i);
  }
  return indexes;
}



const App = () => {



  const [sudoku, setSudoku] = useState(Array.from({ length: 9 }, (v, i) => { return Array.from({ length: 9 }, (v, i) => { return `` }) }));
  const buf = Array.from({ length: 9 }, (v, i) => { return Array.from({ length: 9 }, (v, i) => { return null }) });
  const [smallnote, setsmallnote] = useState(Array.from({ length: 9 }, (v, i) => { return Array.from({ length: 9 }, (v, i) => { return [] }) }))
  const [selectedBlock, setselectedBlock] = useState([2, 2]);
  const [immutable, setimmutable] = useState(Array.from({ length: 9 }, (v, i) => { return Array.from({ length: 9 }, (v, i) => { return false }) }));
  const [openpopup, setopenpopup] = useState(false);
  const clickblock = (x, y) => {
    return (compareArrays(selectedBlock, [x, y]) ? setselectedBlock([null, null]) : setselectedBlock([x, y]))
  }
  const [noteMode, setnoteMode] = useState(false);
  const allowchange = (compareArrays(selectedBlock, [null, null]) ? false : true);

  const handleKey = (e) => {

    if (allowchange) {

      setselectedBlock((prev) => {
        switch (e.key) {
          case 'ArrowUp': {
            if (selectedBlock[1] != 0) {

              return [prev[0], prev[1] - 1]

            } else {
              return prev
            }
          }
          case 'ArrowDown': {
            if (selectedBlock[1] != 8) {

              return [prev[0], prev[1] + 1]

            } else {
              return prev
            }
          }
          case 'ArrowLeft': {
            if (selectedBlock[0] != 0) {

              return [prev[0] - 1, prev[1]]

            } else {
              return prev
            }
          }
          case 'ArrowRight': {
            if (selectedBlock[0] != 8) {

              return [prev[0] + 1, prev[1]]

            } else {
              return prev
            }
          }
          default: return prev
        }
      })

      if (e.key == "-") {
        setimmutable((prev) => {
          const x = selectedBlock[0];
          const y = selectedBlock[1];
          prev[x][y] = (prev[x][y] == true ? false : true);
          return [...prev]
        })
      }


      if (!noteMode) {

        // Edit Mode
        if (e.key == "+") {
          setnoteMode(true)
        }
        if (!immutable[selectedBlock[0]][selectedBlock[1]]) {
          setSudoku((prev) => {

            if (["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(e.key)) {

              setsmallnote((d) => {

                d[selectedBlock[0]] = d[selectedBlock[0]].map((item) => {
                  return item.filter((as) => {
                    return as !== e.key
                  })
                })

                for (let i = 0; i < 9; i++) {
                  d[i][selectedBlock[1]] = d[i][selectedBlock[1]].filter((as) => { return as !== e.key })
                }

                Array.from({ length: 9 }, (v, ia) => { return null }).map((a, i) => {
                  let coox = whole2grid(selectedBlock[0], selectedBlock[1])[0];
                  let cooy = i;
                  let x = grid2whole(coox, cooy)[0]
                  let y = grid2whole(coox, cooy)[1]
                  d[x][y] = d[x][y].filter((as) => {
                    return as !== e.key
                  })
                })

                return [...d]
              })



              prev[selectedBlock[0]][selectedBlock[1]] = e.key;
              return [...prev]
            } else if (e.key == "0") {
              prev[selectedBlock[0]][selectedBlock[1]] = "";
              return [...prev]
            } else {
              return [...prev]
            }
          })
        }

      } else if (noteMode) {

        if (e.key == "+") {
          setnoteMode(false)
        }

        setsmallnote((prev) => {
          if (["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(e.key)) {
            const i = prev[selectedBlock[0]][selectedBlock[1]].indexOf(e.key);
            if (i == -1) {
              prev[selectedBlock[0]][selectedBlock[1]] = [...prev[selectedBlock[0]][selectedBlock[1]], e.key].sort((a, b) => { return a - b });

              return [...prev]

            } else {
              prev[selectedBlock[0]][selectedBlock[1]].splice(i, 1).sort((a, b) => { return a - b });

              return [...prev]
            }


          } else if (e.key == "0") {
            prev[selectedBlock[0]][selectedBlock[1]] = [];
            return [...prev]
          } else {

            return [...prev]
          }
        })

      } else {
        setnoteMode(false)
      }


    } else {

      return;

    }

  }

  useEffect(() => {
    if (localStorage.getItem("sudoku") !== null) {
      setSudoku(JSON.parse(localStorage.getItem("sudoku")).sudoku)
      setsmallnote(JSON.parse(localStorage.getItem("sudoku")).smallnote)
      setimmutable(JSON.parse(localStorage.getItem("sudoku")).immutable)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("sudoku", JSON.stringify({
      sudoku,
      smallnote,
      immutable
    }))
  }, [sudoku, smallnote, immutable])

  return (
    <div className={`app ${(openpopup? "openpopup": "")}`}>
      
      <div className={`top `}>
        <span>Sudoku by Zup </span>
        <button id="openpopup" onClick={()=>{setopenpopup((o)=>!o)}}><AiOutlineInfoCircle /></button>
        <Popup open={openpopup} closeOnDocumentClick onClose={()=>{setopenpopup(false)}}>
          <div className="modal">
            <div className="content">
              <h2>Sudoku by Zup</h2>
              <p>數獨網頁版</p>
            </div>
          </div>
        </Popup>
      </div>
      <div id="sudoku" >
        {buf.map((a, i1) => {
          return (
            <div className="largeblock">
              {a.map((d, i2) => {


                const x = grid2whole(i1, i2)[0]
                const y = grid2whole(i1, i2)[1]
                const value = sudoku[x][y];
                const note = smallnote[x][y];
                const selected = (compareArrays(selectedBlock, [x, y]) ? "blockSelected" : "");
                const helpline = ((selectedBlock[0] == x || selectedBlock[1] == y) ? "highlighted" : "");
                const assistedcolor = ((indexOfAll(sudoku.flat(), value).length > 1 && !compareArrays(selectedBlock, [null, null])) ? (sudoku[selectedBlock[0]][selectedBlock[1]] == value ? "assistedcolor" : "") : "");
                let warning = ((indexOfAll(sudoku[x], value).length > 1 || indexOfAll(sudoku.map((d) => { return d[y] }), value).length > 1) ? "warning" : "");

                if (indexOfAll(Array.from({ length: 9 }, (v, i) => { return i }).map((d, i) => {
                  return sudoku[grid2whole(i1, i)[0]][grid2whole(i1, i)[1]]
                }), value).length > 1) {
                  warning = "warning";
                }

                const unchangable = (immutable[x][y] == true ? "unchangable" : "");

                return (
                  <div
                    tabIndex={0}
                    onKeyDown={(e) => { handleKey(e) }}
                    className={`block ${selected} ${helpline} ${warning} ${assistedcolor} ${unchangable} `}
                    id={`${(!value ? "noteMode" : "")}`}
                    onClick={() => { clickblock(x, y) }}>
                    {`${(value ? value : note)}`}
                  </div>
                )
              })}
            </div>)
        })
        }
      </div>

      <div className="right-side">
        <Draggable handle='.handle'>
          <div className="draggable">
            <div className='handle'><p>-</p></div>
            <div className="tool">
              <button onKeyDown={(e) => { handleKey(e) }} onClick={() => { handleKey({ "key": "+" }) }} id={(noteMode ? "noteMode" : "")}>note</button>
              <button onKeyDown={(e) => { handleKey(e) }} onClick={() => { handleKey({ "key": "-" }) }} id={(allowchange? (immutable[selectedBlock[0]][selectedBlock[1]]? "fixed": ""): "")}>fixed</button>
              {[0, 7, 8, 9, 4, 5, 6, 1, 2, 3].map((d, i) => {
                const full = ((indexOfAll(sudoku.flat(), `${d}`).length == 9) ? "full" : "")
                return (
                  <button onKeyDown={(e) => { handleKey(e) }} onClick={() => { handleKey({ "key": `${d}` }) }} id={full}>{(d == 0 ? "clear" : d)}</button>
                )
              })}
            </div>
            <div id="other-place">
              <button onClick={() => {
                setSudoku(Array.from({ length: 9 }, (v, i) => { return Array.from({ length: 9 }, (v, i) => { return `` }) }))
                setsmallnote(Array.from({ length: 9 }, (v, i) => { return Array.from({ length: 9 }, (v, i) => { return [] }) }))
                setimmutable(Array.from({ length: 9 }, (v, i) => { return Array.from({ length: 9 }, (v, i) => { return false }) }))
              }}>reset
              </button>
              <button onClick={() => {
                setimmutable((prev) => {
                  sudoku.map((d, i1) => {
                    d.map((a, i2) => {
                      if (a !== "") {
                        prev[i1][i2] = true;
                      }
                    })
                  })
                  return [...prev]
                })
              }}>
                lock all
              </button>
              <button onClick={() => {
                setimmutable(Array.from({ length: 9 }, (v, i) => { return Array.from({ length: 9 }, (v, i) => { return false }) }))
              }}>
                unlock all
              </button>
            </div>
          </div>
        </Draggable>

      </div>


    </div>
  )
}

export default App
