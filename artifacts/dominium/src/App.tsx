import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Layout } from '@/components/layout/layout';
import { AuthProvider } from '@/contexts/auth-context';

import Home from '@/pages/home';
import Status from '@/pages/status';
import News from '@/pages/news';
import NewsDetail from '@/pages/news-detail';
import Store from '@/pages/store';
import Leaderboard from '@/pages/leaderboard';
import Rules from '@/pages/rules';
import Staff from '@/pages/staff';
import FAQ from '@/pages/faq';
import BanAppeal from '@/pages/ban-appeal';
import Contact from '@/pages/contact';
import MapPage from '@/pages/map';

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/status" component={Status} />
        <Route path="/news" component={News} />
        <Route path="/news/:id" component={NewsDetail} />
        <Route path="/store" component={Store} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/rules" component={Rules} />
        <Route path="/staff" component={Staff} />
        <Route path="/faq" component={FAQ} />
        <Route path="/ban-appeal" component={BanAppeal} />
        <Route path="/contact" component={Contact} />
        <Route path="/map" component={MapPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
