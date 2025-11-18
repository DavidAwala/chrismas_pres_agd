import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Heart, Gift, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GiftStats {
  id: string;
  slug: string;
  recipient_name: string;
  sender_name: string;
  views_count: number;
  likes_count: number;
  created_at: string;
}

const Analytics = () => {
  const [gifts, setGifts] = useState<GiftStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalStats, setTotalStats] = useState({
    totalGifts: 0,
    totalViews: 0,
    totalLikes: 0,
    avgEngagement: 0,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data, error } = await supabase
          .from("gift_messages")
          .select("id, slug, recipient_name, sender_name, views_count, likes_count, created_at")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          setGifts(data);

          const totalViews = data.reduce((sum, g) => sum + (g.views_count || 0), 0);
          const totalLikes = data.reduce((sum, g) => sum + (g.likes_count || 0), 0);
          const avgEngagement = data.length > 0 ? (totalLikes / totalViews) * 100 || 0 : 0;

          setTotalStats({
            totalGifts: data.length,
            totalViews,
            totalLikes,
            avgEngagement,
          });
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track engagement and views for all gift pages</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Gifts</CardTitle>
              <Gift className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalStats.totalGifts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalStats.totalViews}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <Heart className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalStats.totalLikes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Engagement</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalStats.avgEngagement.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Gift List */}
        <Card>
          <CardHeader>
            <CardTitle>All Gift Pages</CardTitle>
            <CardDescription>Detailed breakdown of each gift message</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {gifts.map((gift) => (
                  <Card key={gift.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">
                            To: {gift.recipient_name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            From: {gift.sender_name || "Anonymous"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Created: {new Date(gift.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex gap-6">
                          <div className="text-center">
                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                              <Eye className="w-4 h-4" />
                              <span className="text-xs">Views</span>
                            </div>
                            <p className="text-2xl font-bold">{gift.views_count || 0}</p>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                              <Heart className="w-4 h-4" />
                              <span className="text-xs">Likes</span>
                            </div>
                            <p className="text-2xl font-bold">{gift.likes_count || 0}</p>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                              <TrendingUp className="w-4 h-4" />
                              <span className="text-xs">Rate</span>
                            </div>
                            <p className="text-2xl font-bold">
                              {gift.views_count
                                ? ((gift.likes_count / gift.views_count) * 100).toFixed(0)
                                : 0}
                              %
                            </p>
                          </div>
                        </div>

                        <Link to={`/gift/${gift.slug}`}>
                          <Button variant="outline">View</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {gifts.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No gift pages created yet</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
