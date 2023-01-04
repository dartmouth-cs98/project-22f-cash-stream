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
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// Watch out for this react-icons path
import { FiArrowDownCircle, FiArrowUpCircle } from "../../../node_modules/react-icons/fi";
import { BsArrowDownUp } from "../../../node_modules/react-icons/bs";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="center">{row.balance}</TableCell>
        <TableCell align="center">{row.inflow}</TableCell>
        <TableCell align="center">{row.outflow}</TableCell>
        <TableCell align="center">{row.netflow}</TableCell>
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
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Date</TableCell>
                    <TableCell align="center">To/From </TableCell>
                    <TableCell align="center"> All Time Flow</TableCell>
                    <TableCell align="center">Flow Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row" align="center"> 
                        {historyRow.date}
                      </TableCell>
                      <TableCell align="center">{historyRow.customerId}</TableCell>
                      <TableCell align="center">{historyRow.amount}</TableCell>
                      <TableCell align="center">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
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
    balance: PropTypes.number.isRequired,
    outflow: PropTypes.number.isRequired,
    inflow: PropTypes.number.isRequired,

    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      }),
    ).isRequired,

    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    netflow: PropTypes.number.isRequired,
  }).isRequired,
};


export const DashboardTable = (rows) => {

  return (
    <ThemeProvider theme={darkTheme}>
        <h4>
          Goerli Network 
          {/*console.log(rows)*/}
        </h4>

      <CssBaseline/>
      
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
                {rows.map((row) => (
                  <Row key={row.name} row={row} /> 
                ))}
              </TableBody>
            </Table>
      </TableContainer>
    </ThemeProvider>
  );
}
