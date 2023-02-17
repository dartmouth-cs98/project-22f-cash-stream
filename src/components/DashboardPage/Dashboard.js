import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
// Watch out for this react-icons path
import { FiArrowDownCircle, FiArrowUpCircle } from "../../../node_modules/react-icons/fi";
import { BsArrowDownUp } from "../../../node_modules/react-icons/bs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown, faCircleXmark} from '@fortawesome/free-solid-svg-icons';
import "../../css/flowInfo.css";
import ether from '../../img/ether.png';
import dai from '../../img/dai.png';

function Row(props) {
  const {row} = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell component="th" scope="row">
          {
            row.name == "ETHx"
            ? <img src={ether} className="img"/>
            : <img src={dai} className="img"/>
          }       
          {row.name}
        </TableCell>
        <TableCell align="center">
          {row.balance}
        </TableCell>
        <TableCell align="center">
          {
            row.formattedInflow == " 0 /mo"
            ? <span><FontAwesomeIcon icon={faCaretUp}/>{row.formattedInflow}</span>
            : <span className="up"><FontAwesomeIcon icon={faCaretUp}/>{row.formattedInflow}</span>
          }
        </TableCell>
        <TableCell align="center">
          {
            row.formattedOutflow == " 0 /mo"
            ? <span><FontAwesomeIcon icon={faCaretDown}/>{row.formattedOutflow}</span>
            : <span className="down"><FontAwesomeIcon icon={faCaretDown}/>{row.formattedOutflow}</span>
          }
        </TableCell>
        <TableCell align="center">
        {
          row.formattedNetflow.slice(0,1) == '-' 
          ? <span className="down">
              <FontAwesomeIcon icon={faCaretDown} className='down'/>&nbsp;{row.formattedNetflow.slice(1, row.formattedNetflow.length)}
            </span>
          : <>
            {
              row.formattedNetflow.slice(0, row.formattedNetflow.length-4) == '0'
              ? <>-&nbsp;{row.formattedNetflow.slice(0, row.formattedNetflow.length)}</>
              : <span className="up"><FontAwesomeIcon icon={faCaretUp} className='up'/>&nbsp;{row.formattedNetflow.slice(0, row.formattedNetflow.length)}</span>
            }
            </>
        }
        </TableCell>
        <TableCell align="center"> 
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <FiArrowUpCircle/> : <FiArrowDownCircle/>}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">Active Streams</Typography>
              <Table size="small" aria-label="purchases">
                { 
                  row.history.length == 0
                  ? <span className="noStream"><p>You have no active streams.</p></span>
                  : <TableHead>
                    <TableRow>
                      <TableCell align="center">Start Date</TableCell>
                      <TableCell align="center">To/From</TableCell>
                      {/* <TableCell align="center"> All Time Flow</TableCell> */}
                      <TableCell align="center">Flow Rate</TableCell>
                      <TableCell align="center"></TableCell>
                    </TableRow>
                  </TableHead>
                }
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row" align="center"> 
                        {historyRow.date}
                      </TableCell>
                      <TableCell align="center">{historyRow.id}</TableCell>
                      {
                        historyRow.amount.slice(0,1) == '+'
                        ? <TableCell align="center" className='up'>
                            <FontAwesomeIcon icon={faCaretUp} className='up'/>
                            <span className='up'>{historyRow.amount.slice(1, historyRow.amount.length)}</span>
                          </TableCell>
                        : <TableCell align="center" className='down'>
                            <FontAwesomeIcon icon={faCaretDown} className='down'/>
                            <span className='down'>{historyRow.amount.slice(1, historyRow.amount.length)}</span>
                          </TableCell>
                      }
                      <TableCell align='center'>
                        {
                          historyRow.amount.slice(0,1) == '-'
                          ? <FontAwesomeIcon className='cursor' icon={faCircleXmark} onClick={()=>{
                            props.setClose(row.name, historyRow.id)
                          }}/>
                          : <div>-</div>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    //balance: PropTypes.string.isRequired,
    formattedOutflow: PropTypes.string.isRequired,
    formattedInflow: PropTypes.string.isRequired,

    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      }),
    ).isRequired,
    
    //name: PropTypes.string.isRequired,
    //price: PropTypes.number.isRequired,
    //netflow: PropTypes.number.isRequired,
  }).isRequired,
};


export const DashboardTable = (props) => {
  return (
    <div>
      {/*<div className='dashboardTitle'><h4 className='mb-3 title'>Streams</h4></div>*/}
      <TableContainer component={Paper} class='dashboard'>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell>Tokens</TableCell>
              <TableCell align="center">Balance</TableCell>
              <TableCell align="center">Inflow</TableCell>
              <TableCell align="center">Outflow</TableCell>
              <TableCell align="center">Netflow</TableCell>
              <TableCell align="center"><BsArrowDownUp/></TableCell> {/* Spacer for the Expand/Collapse Arrow */}
            </TableRow>
          </TableHead>
          <TableBody>
            {
              props.tokensInfo.map((row) => (
                <Row key={row.name} row={row} setClose={props.setClose}/>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}