import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResolvLogo } from "@/components/icons/ResolvLogo";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <Layout title="Dashboard" breadcrumb={["HOME", "Dashboard"]}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => setLocation("/resolv")}
        >
          <Card className="overflow-hidden bg-card/50 backdrop-blur border-primary/20 cursor-pointer hover:bg-card/70 transition-colors group">
            <CardHeader className="flex flex-row items-center gap-4">
              <ResolvLogo className="w-16 h-16 group-hover:scale-105 transition-transform" />
              <div>
                <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                  Resolv
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Points and Rank
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Check your Resolv points and ranking
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Three placeholder cards */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (i + 1) * 0.1 }}
          >
            <Card className="overflow-hidden bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle>Card {i}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This is a sample card with Web3-themed styling.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </Layout>
  );
}