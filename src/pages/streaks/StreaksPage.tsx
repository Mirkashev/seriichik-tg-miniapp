import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLaunchParams } from '@tma.js/sdk-react';
import { usePartners } from '@/entities/partner';
import type { Partner } from '@/entities/partner';
import { Button } from '@/shared/ui/Button';

export const StreaksPage = () => {
  const navigate = useNavigate();
  const launchParams = useLaunchParams(true);
  const user = launchParams.tgWebAppData?.user;
  const userId = user?.id;

  const isPremium = useMemo(() => {
    return user?.is_premium ?? false;
  }, [user]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = usePartners(
    userId || 0
  );

  console.log(data);

  const partners = useMemo(() => {
    return data?.pages.flatMap((page) => page.partners) ?? [];
  }, [data]);

  const getPartnerName = (partner: Partner) => {
    if (partner.toUserFirstName || partner.toUserLastName) {
      return [partner.toUserFirstName, partner.toUserLastName].filter(Boolean).join(' ');
    }
    return partner.toUserUsername || 'Unknown';
  };

  if (isPremium) {
    return (
      <div>
        <h1>Streaks</h1>
        <p>Premium user placeholder UI</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <h1>Streaks</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Streaks</h1>
        <p>Error loading partners</p>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '12px' }}>
      <h1>Streaks</h1>
      <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
        {partners.length === 0 ? (
          <p>No partners found</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {partners.map((partner) => (
              <li
                key={partner.chatId}
                onClick={() => navigate(`/streak/${partner.chatId}`)}
                style={{ cursor: 'pointer', padding: '12px', borderBottom: '1px solid #e0e0e0' }}
              >
                <div>
                  <strong>{getPartnerName(partner)}</strong>
                </div>
                <div>Streak: {partner.streakCount}</div>
                {partner.pet && (
                  <div>
                    Pet Level: {partner.pet.level} | EXP: {partner.pet.exp}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        )}
      </div>
      <div style={{ position: 'sticky', bottom: 0, padding: '12px 0' }}>
        <Button fullWidth>Invite</Button>
      </div>
    </div>
  );
};
