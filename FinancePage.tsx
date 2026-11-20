import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import {
  MonetizationOn,
  TrendingUp,
  AccountBalanceWallet,
  Receipt,
  CheckCircle,
  Pending
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const FinancePage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [tabValue, setTabValue] = useState(0);

  // Mock Data
  const transactions = [
    { id: 'TXN-001', client: 'John Doe', service: 'Home Cleaning', amount: '$150.00', date: '2023-10-25', status: 'Paid' },
    { id: 'TXN-002', client: 'Jane Smith', service: 'Office Cleaning', amount: '$450.00', date: '2023-10-24', status: 'Pending' },
    { id: 'TXN-003', client: 'Michael Brown', service: 'Deep Clean', amount: '$300.00', date: '2023-10-23', status: 'Paid' },
    { id: 'TXN-004', client: 'Emily Davis', service: 'Carpet Cleaning', amount: '$120.00', date: '2023-10-22', status: 'Failed' },
  ];

  const expenses = [
    { id: 'EXP-101', description: 'Cleaning Supplies Restock', amount: '$500.00', date: '2023-10-20', category: 'Inventory' },
    { id: 'EXP-102', description: 'Staff Wages - Week 42', amount: '$2,400.00', date: '2023-10-20', category: 'Payroll' },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: isDark ? '#fff' : '#333' }}>Finance & Payments</Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid >
          <Card sx={{ bgcolor: isDark ? '#1E1E1E' : '#fff', borderLeft: '5px solid #E91E63' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(233, 30, 99, 0.1)', color: '#E91E63' }}><MonetizationOn /></Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ color: isDark ? '#fff' : '#333' }}>$12,450</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid >
          <Card sx={{ bgcolor: isDark ? '#1E1E1E' : '#fff', borderLeft: '5px solid #4CAF50' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50' }}><AccountBalanceWallet /></Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Pending</Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ color: isDark ? '#fff' : '#333' }}>$850</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid >
          <Card sx={{ bgcolor: isDark ? '#1E1E1E' : '#fff', borderLeft: '5px solid #FF9800' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255, 152, 0, 0.1)', color: '#FF9800' }}><Receipt /></Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Expenses</Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ color: isDark ? '#fff' : '#333' }}>$3,200</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid >
          <Card sx={{ bgcolor: isDark ? '#1E1E1E' : '#fff', borderLeft: '5px solid #2196F3' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(33, 150, 243, 0.1)', color: '#2196F3' }}><TrendingUp /></Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Net Profit</Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ color: isDark ? '#fff' : '#333' }}>$8,400</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ bgcolor: isDark ? '#1E1E1E' : '#fff', borderRadius: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={(_, newVal) => setTabValue(newVal)}
          sx={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e0e0e0'}` }}
        >
          <Tab label="Transactions" />
          <Tab label="Expenses" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id} hover>
                    <TableCell sx={{ fontFamily: 'monospace' }}>{t.id}</TableCell>
                    <TableCell>{t.client}</TableCell>
                    <TableCell>{t.service}</TableCell>
                    <TableCell>{t.date}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t.amount}</TableCell>
                    <TableCell>
                      <Chip 
                        label={t.status} 
                        color={t.status === 'Paid' ? 'success' : (t.status === 'Pending' ? 'warning' : 'error')} 
                        size="small" 
                        icon={t.status === 'Paid' ? <CheckCircle fontSize="small" /> : <Pending fontSize="small" />}
                      />
                    </TableCell>
                    <TableCell align="right">
                       {t.status === 'Pending' && <Button size="small" variant="outlined">Mark Paid</Button>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
           <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((e) => (
                  <TableRow key={e.id} hover>
                    <TableCell sx={{ fontFamily: 'monospace' }}>{e.id}</TableCell>
                    <TableCell>{e.description}</TableCell>
                    <TableCell><Chip label={e.category} variant="outlined" size="small" /></TableCell>
                    <TableCell>{e.date}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'error.main' }}>-{e.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default FinancePage;