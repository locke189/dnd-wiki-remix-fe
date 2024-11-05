import { Sidebar } from '../../components/ui/sidebar';
import {} from '../../components/ui/dropdown-menu';
import {} from '../../components/ui/collapsible';
import { AppSidebarHeader } from './app-sidebar-header';
import AppSidebarFooter from './app-sidebar-footer';
import { AppSidebarContent } from './app-sidebar-content';

export function AppSidebar() {
  return (
    <Sidebar>
      <AppSidebarHeader />
      <AppSidebarContent />
      <AppSidebarFooter />
    </Sidebar>
  );
}
