import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

interface ResolvPoints {
  totalPoints: number;
  dailyPoints: number;
  boosts: {
    total: number;
    epoch: {
      name: string;
      value: number;
    };
    refereeWelcomeBoost: number;
    dineroPowerUser: number;
    hyperliquidPowerUser: number;
    resolvPowerUser: {
      level: string;
      value: number;
    };
  };
  dailyActivities: Record<string, number>;
}

interface LeaderboardData {
  rank: number | null; // Changed to number | null
  points: number;
  address: string;
  // Add other fields if needed
}

export default function Resolv() {
  const [addresses, setAddresses] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: pointsData, isLoading: isLoadingPoints, error: pointsError, refetch: refetchPoints } = useQuery<ResolvPoints[]>({
    queryKey: ["resolv-points", addresses],
    queryFn: async () => {
      if (!addresses.trim()) return [];

      const addressList = addresses.split(/[\n,]+/).map(a => a.trim()).filter(Boolean);

      try {
        const results = await Promise.all(
          addressList.map(async (address) => {
            let evmAddress = address;

            // If it's an ENS name, resolve it first
            if (address.toLowerCase().endsWith('.eth')) {
              try {
                const ensResponse = await fetch(`/api/resolv/ens/${address}`);
                if (!ensResponse.ok) {
                  throw new Error(`Failed to resolve ENS name: ${address}`);
                }
                const ensData = await ensResponse.json();
                if (!ensData.address) {
                  throw new Error(`No address found for ENS name: ${address}`);
                }
                evmAddress = ensData.address;
              } catch (error) {
                console.error('ENS resolution error:', error);
                throw new Error(`Failed to resolve ENS name: ${address}`);
              }
            }

            const response = await fetch(`/api/resolv/points/${evmAddress}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch points for address: ${evmAddress}`);
            }
            return response.json();
          })
        );

        return results;
      } catch (error) {
        console.error('Error fetching points data:', error);
        throw error;
      }
    },
    enabled: isSubmitted,
  });

  const { data: leaderboardData, isLoading: isLoadingLeaderboard } = useQuery<LeaderboardData[]>({
    queryKey: ["resolv-leaderboard", addresses],
    queryFn: async () => {
      if (!addresses.trim()) return [];

      const addressList = addresses.split(/[\n,]+/).map(a => a.trim()).filter(Boolean);

      try {
        const results = await Promise.all(
          addressList.map(async (address) => {
            let evmAddress = address;

            if (address.toLowerCase().endsWith('.eth')) {
              const ensResponse = await fetch(`/api/resolv/ens/${address}`);
              const ensData = await ensResponse.json();
              evmAddress = ensData.address || address;
            }

            const response = await fetch(`/api/resolv/leaderboard/${evmAddress}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch leaderboard data for: ${evmAddress}`);
            }
            return response.json();
          })
        );

        return results;
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        return [];
      }
    },
    enabled: isSubmitted,
  });

  const handleCheck = () => {
    if (addresses.trim()) {
      setIsSubmitted(true);
      refetchPoints();
    }
  };

  const formatNumber = (num: number | null) => { // Added null handling
    return num !== null ? new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
    }).format(num) : "N/A"; // Handle null case
  };

  const isLoading = isLoadingPoints || isLoadingLeaderboard;
  const error = pointsError;

  return (
    <Layout title="Resolv Points Checker" breadcrumb={["HOME", "Resolv"]}>
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Resolv Points Checker 🔍</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter EVM addresses or ENS names (e.g., vitalik.eth). Separate multiple addresses with commas or new lines."
              value={addresses}
              onChange={(e) => setAddresses(e.target.value)}
              className="min-h-[100px] mb-4 font-mono"
            />
            <Button
              onClick={handleCheck}
              disabled={isLoading || !addresses.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Checking Points...</span>
                </div>
              ) : (
                "Check Points"
              )}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive mb-4">
            <CardContent className="pt-6">
              <p className="text-destructive">{error instanceof Error ? error.message : 'Error fetching data. Please try again.'}</p>
            </CardContent>
          </Card>
        )}

        {pointsData && pointsData.map((result, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="mb-4 overflow-hidden border border-primary/20">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-600/10">
                <CardTitle className="text-xl">Points Summary</CardTitle>
                {leaderboardData && leaderboardData[index] && (
                  <div className="text-sm text-muted-foreground">
                    Rank: #{leaderboardData[index].rank ? formatNumber(leaderboardData[index].rank) : 'N/A'}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-primary/5 backdrop-blur">
                      <p className="text-sm text-muted-foreground">Total Points</p>
                      <p className="text-2xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                        {formatNumber(result.totalPoints)}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/5 backdrop-blur">
                      <p className="text-sm text-muted-foreground">Daily Points</p>
                      <p className="text-2xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                        {formatNumber(result.dailyPoints)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Boosts</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-primary/5">
                        <p className="text-sm text-muted-foreground">Total Boosts</p>
                        <p className="text-xl font-semibold">{result.boosts.total}%</p>
                      </div>
                      <div className="p-4 rounded-lg bg-primary/5">
                        <p className="text-sm text-muted-foreground">{result.boosts.epoch.name}</p>
                        <p className="text-xl font-semibold">{result.boosts.epoch.value}%</p>
                      </div>
                      <div className="p-4 rounded-lg bg-primary/5">
                        <p className="text-sm text-muted-foreground">Power User Level</p>
                        <p className="text-xl font-semibold">{result.boosts.resolvPowerUser.level}</p>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mt-6">Daily Activities</h3>
                    <div className="grid gap-2">
                      {Object.entries(result.dailyActivities)
                        .filter(([, value]) => value > 0)
                        .map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                            <span className="text-sm capitalize">
                              {key
                                .replace(/([A-Z])/g, ' $1')
                                .trim()
                                .split(/(?=[A-Z])/)
                                .join(' ')
                                .replace(/([a-z])([A-Z])/g, '$1 $2')
                                .toLowerCase()}
                            </span>
                            <span className="font-medium">{formatNumber(value)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </Layout>
  );
}