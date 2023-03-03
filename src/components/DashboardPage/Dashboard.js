import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, CircularProgress, Tooltip } from '@mui/material';
import { FiArrowDownCircle, FiArrowUpCircle } from "../../../node_modules/react-icons/fi"; // Watch out for this react-icons path
import { BsArrowDownUp } from "../../../node_modules/react-icons/bs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown, faCircleXmark, faPenToSquare} from '@fortawesome/free-solid-svg-icons';
import "../../css/flowInfo.css";
import ether from '../../img/ether.png';
import dai from '../../img/dai.png';
import { EditForm } from './EditForm';

function Row(props) {
  const {row} = props; //row containing information for each token
  const [open, setOpen] = React.useState(false); //drop down for dashboard

  const [editOpen, setEditOpen] = React.useState(false); //open modal when we edit a stream's name
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);
  const [editAddress, setEditAddress] = React.useState(""); //address of the stream being renamed

  const [tooltip, setTooltip] = React.useState("Click to copy") //tooltip message for copy address (set to "Copied!" after copying)

  //fetch stream names from local storage (Or set up storage if it is not already there)
  if (localStorage.getItem('ETHx_contact') == null){
    localStorage.setItem('ETHx_contact', JSON.stringify([]));
  }

  if (localStorage.getItem('fDAIx_contact') == null){
    localStorage.setItem('fDAIx_contact', JSON.stringify([]));
  }

  //Fetch stream name associated with the stream's wallet address
  function search_contact(address){
    if (row.name == "ETHx"){
      var contact = localStorage.getItem('ETHx_contact');
      var parsed_contact = JSON.parse(contact);
  
      for(const item of parsed_contact){
        if(typeof item[address] !== "undefined"){
          return item[address];
        }
      }
    }
    else if (row.name == "fDAIx"){
      if (row.name == "fDAIx"){
        var contact = localStorage.getItem('fDAIx_contact');
        var parsed_contact = JSON.parse(contact);
    
        for(const item of parsed_contact){
          if(typeof item[address] !== "undefined"){
            return item[address];
          }
        }
      }
    }
    return undefined
  }

  //copy wallet address to clipboard
  function copyAddress(address){
    navigator.clipboard.writeText(address);
    setTooltip("Copied!");
  }

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        {/*TOKEN ICON AND NAME=========================================================*/}
        <TableCell component="th" scope="row">
          {
            row.name == "ETHx"
            ? <img src={ether} className="img"/>
            : <img src={dai} className="img"/>
          }       
          {row.name}
        </TableCell>

        {/*TOKEN BALANCE=========================================================*/}
        <TableCell align="center">
          {row.balance}
        </TableCell>

        {/*TOKEN INFLOW=========================================================*/}
        <TableCell align="center">
          {
            row.formattedInflow == " 0 /mo"
            ? <span><FontAwesomeIcon icon={faCaretUp}/>{row.formattedInflow}</span>
            : <span className="up"><FontAwesomeIcon icon={faCaretUp}/>{row.formattedInflow}</span>
          }
        </TableCell>

        {/*TOKEN OUTFLOW=========================================================*/}
        <TableCell align="center">
          {
            row.formattedOutflow == " 0 /mo"
            ? <span><FontAwesomeIcon icon={faCaretDown}/>{row.formattedOutflow}</span>
            : <span className="down"><FontAwesomeIcon icon={faCaretDown}/>{row.formattedOutflow}</span>
          }
        </TableCell>

        {/*TOKEN NETFLOW=========================================================*/}
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

        {/*DROP DOWN BUTTON=========================================================*/}
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
                      <TableCell align="left">Start Date</TableCell>
                      <TableCell align="left">Stream</TableCell>
                      <TableCell align="left">To/From</TableCell>
                      <TableCell align="left">Flow Rate</TableCell>
                      <TableCell align="left"></TableCell>
                    </TableRow>
                  </TableHead>
                }
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.id}>

                       {/*STREAM START DATE=========================================================*/}
                      <TableCell component="th" scope="row" align="left"> 
                        {historyRow.date}
                      </TableCell>

                       {/*STREAM NAME=========================================================*/}
                      <TableCell align="left">
                        {
                          typeof search_contact(historyRow.id) !== "undefined" && search_contact(historyRow.id) !== ""
                          ? search_contact(historyRow.id)
                          : "untitled stream"
                        }
                        <FontAwesomeIcon icon={faPenToSquare} className='marginLeft15px cursor' 
                          onClick={()=>{
                            setEditAddress(historyRow.id);
                            handleEditOpen();
                        }}/>
                      </TableCell>

                       {/*WALLET ADDRESS=========================================================*/}
                      <TableCell align="left">
                        <Tooltip title={tooltip} arrow placement='top' 
                          onClick={()=>{copyAddress(historyRow.id)}}
                          onMouseOut={()=>{setTooltip("Click to copy")}}
                        >
                          <div className='address'>{`${historyRow.id.substring(0, 8)}...${historyRow.id.substring(36)}`}</div>
                        </Tooltip>
                      </TableCell>

                       {/*FLOWRATE=========================================================*/}
                      {
                        historyRow.amount.slice(0,1) == '+'
                        ? <TableCell align="left" className='up'>
                            <FontAwesomeIcon icon={faCaretUp} className='up'/>
                            <span className='up'>{historyRow.amount.slice(1, historyRow.amount.length)}</span>
                          </TableCell>
                        : <TableCell align="left" className='down'>
                            <FontAwesomeIcon icon={faCaretDown} className='down'/>
                            <span className='down'>{historyRow.amount.slice(1, historyRow.amount.length)}</span>
                          </TableCell>
                      }

                       {/*DELETE STREAM ICON=========================================================*/}
                      <TableCell align='left'>
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
      <EditForm token={row.name} address={editAddress} editOpen={editOpen} handleEditClose={handleEditClose}/>
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
      {
      props.tokensInfo.length == 0
      ? <div className='dashboardLoading'><CircularProgress color="inherit"/></div>
      : <TableContainer component={Paper} class='dashboard'>
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
    }
    </div>
  );
}