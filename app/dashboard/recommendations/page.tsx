import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

// PlaceholderCard Component
function PlaceholderCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-left">
                    <p>This is an example.</p>
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="secondary" className="flex items-center gap-2" disabled>
                    Coming Soon
                </Button>
            </CardFooter>
        </Card>
    );
}

// RecommendationsPage Component
export default function RecommendationsPage() {
    return (
        <main className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">Recommendations</h1>
            </div>
            <div className="grid grid-cols-1 gap-4">
                <PlaceholderCard />
            </div>
        </main>
    );
}
