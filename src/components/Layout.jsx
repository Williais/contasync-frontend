
import { useContext, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Avatar, Typography, Divider, AppBar, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useUser } from '../contexts/UserContext'; // Usando nosso hook

const drawerWidth = 240;

function Layout({ children }) {
  const { usuario } = useUser();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

const handleLogout = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        navigate('/login');
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
    }
};

  // Conteúdo da Navbar
  const drawerContent = (
    // Este Box externo garante o comportamento de coluna flexível
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div> {/* Agrupa a parte de cima */}
        <Toolbar>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
            ContaSync
          </Typography>
        </Toolbar>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}/>

        {usuario && (
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={usuario.user_metadata.picture} alt={usuario.user_metadata.full_name} />
            <Typography variant="subtitle1" sx={{ color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {usuario.user_metadata.full_name}
            </Typography>
          </Box>
        )}
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}/>
        
        <List>
          {[
            { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
            { text: 'Categorias', icon: <CategoryIcon />, path: '/categorias' },
            { text: 'Lembretes', icon: <NotificationsIcon />, path: '/lembretes' }
          ].map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={Link} to={item.path} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }, color: '#d1d5db' }}>
                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>

      {/* O Espaçador Mágico */}
      <Box sx={{ flexGrow: 1 }} />

      <div> {/* Agrupa a parte de baixo */}
        <List>
            <ListItem disablePadding>
                <ListItemButton onClick={handleLogout} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }, color: '#d1d5db' }}>
                    <ListItemIcon sx={{ color: 'inherit' }}><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItemButton>
            </ListItem>
        </List>
      </div>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          display: { xs: 'block', md: 'none' }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            ContaSync
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#1f2937' },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: '#1f2937',
              color: '#e5e7eb',
              borderRight: 'none',
              borderTopRightRadius: '16px',
              borderBottomRightRadius: '16px',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar sx={{ display: { xs: 'block', md: 'none' } }} />
        {children}
      </Box>
    </Box>
  );
}

export default Layout;