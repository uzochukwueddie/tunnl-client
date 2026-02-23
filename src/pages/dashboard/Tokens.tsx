import { lazy, useActionState, useEffect, useOptimistic, useState, useTransition, type ReactElement } from 'react';
import type { Token } from '../../types';
import { tokenService } from '../../services/token.service';
import { EmptyState } from '../../components/shared/EmptyState';
import { HardDrive } from 'lucide-react';

const TokenForm = lazy(() =>
  import('../../components/pages/dashboard/tokens/TokenForm').then((m) => ({ default: m.TokenForm }))
);
const TokenSuccessAlert = lazy(() =>
  import('../../components/pages/dashboard/tokens/TokenSuccessAlert').then((m) => ({ default: m.TokenSuccessAlert }))
);
const TokenListItem = lazy(() =>
  import('../../components/pages/dashboard/tokens/TokenListItem').then((m) => ({ default: m.TokenListItem }))
);
const ConfirmationModal = lazy(() =>
  import('../../components/shared/ConfirmationModal').then((m) => ({ default: m.ConfirmationModal }))
);

type CreateTokenState = {
  error: string;
  success: boolean;
  token: string;
};

export function Tokens(): ReactElement {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  const [tokenToRevoke, setTokenToRevoke] = useState<Token | null>(null);
  const [tokenToDelete, setTokenToDelete] = useState<Token | null>(null);

  // useTransition for loading tokens
  const [isLoadingTokens, startLoadingTransition] = useTransition();

  // useTransition for revoke/delete operations
  const [isRevokingToken, startRevokeTransition] = useTransition();
  const [isDeletingToken, startDeleteTransition] = useTransition();

  const [optimisticTokens, setOptimisticTokens] = useOptimistic(
    tokens,
    (current, action: { type: 'revoke' | 'delete'; id: string }) => {
      if (action.type === 'revoke') {
        return current.map((t) => (t.id === action.id ? { ...t, status: 'inactive' as const } : t));
      }
      return current.filter((t) => t.id !== action.id);
    }
  );

  const createTokenAction = async (_prevState: CreateTokenState, formData: FormData): Promise<CreateTokenState> => {
    const name = formData.get('name') as string;

    if (!name) {
      return { error: '', success: false, token: '' };
    }

    try {
      const response = await tokenService.createToken(name);
      setTokens((prev) => [response.result, ...prev]);
      return {
        error: '',
        success: true,
        token: response.result.token || ''
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error?.message : 'Failed to create token',
        success: false,
        token: ''
      };
    }
  };
  const [createState, createFormAction, isCreating] = useActionState(createTokenAction, {
    error: '',
    success: false,
    token: ''
  });

  const loadTokens = () => {
    startLoadingTransition(async () => {
      try {
        const response = await tokenService.listTokens();
        setTokens(response.result);
      } catch (error) {
        console.log(error);
      }
    });
  };

  useEffect(() => {
    loadTokens();
  }, []);

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(createState.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmRevoke = (token: Token) => {
    setTokenToRevoke(token);
  };

  const confirmDelete = (token: Token) => {
    setTokenToDelete(token);
  };

  const cancelRevoke = () => {
    setTokenToRevoke(null);
  };

  const cancelDelete = () => {
    setTokenToDelete(null);
  };

  const revokeToken = () => {
    if (!tokenToRevoke) return;

    startRevokeTransition(async () => {
      setOptimisticTokens({ type: 'revoke', id: tokenToRevoke.id });

      try {
        await tokenService.revokeToken(tokenToRevoke.id);
        setTokenToRevoke(null);
        loadTokens();
      } catch (error) {
        console.log(error);
        alert('Failed to revoke token. Please try again.');
      }
    });
  };

  const deleteToken = () => {
    if (!tokenToDelete) return;

    startDeleteTransition(async () => {
      setOptimisticTokens({ type: 'delete', id: tokenToDelete.id });

      try {
        await tokenService.deleteToken(tokenToDelete.id);
        setTokenToDelete(null);
        loadTokens();
      } catch (error) {
        console.log(error);
        alert('Failed to delete token. Please try again.');
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-display font-bold text-white">API Tokens</h2>
        <p className="text-slate-400 mt-1">Manage your API authentication tokens</p>
      </div>

      <TokenForm formAction={createFormAction} isPending={isCreating} error={createState.error} />

      {createState.success && createState.token && (
        <div className="card">
          <div className="card-body">
            <TokenSuccessAlert token={createState.token} copied={copied} onCopy={copyToken} />
          </div>
        </div>
      )}

      {/* Tokens List */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-xl font-display font-semibold text-white">Your Tokens</h3>
        </div>
        <div className="card-body p-0">
          {isLoadingTokens && !optimisticTokens.length ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between animate-pulse">
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-slate-800 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                  </div>
                  <div className="w-20 h-8 bg-slate-800 rounded"></div>
                </div>
              ))}
            </div>
          ) : !optimisticTokens.length ? (
            <EmptyState
              icon={<HardDrive className="w-10 h-10 text-slate-600" />}
              title="No tokens yets"
              description="Create your first API token to get started"
            />
          ) : (
            <div className="divide-y divide-slate-800">
              {optimisticTokens.map((token) => (
                <TokenListItem key={token.id} token={token} onRevoke={confirmRevoke} onDelete={confirmDelete} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Revoke Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!tokenToRevoke}
        title="Revoke Token?"
        message={`Are you sure you want to revoke the token "${tokenToRevoke?.name}"?`}
        description="This will change the token status to inactive. Any applications using this token will lose access."
        confirmText={isRevokingToken ? 'Revoking...' : 'Revoke Token'}
        cancelText="Cancel"
        onConfirm={revokeToken}
        onCancel={cancelRevoke}
        isLoading={isRevokingToken}
        variant="danger"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!tokenToDelete}
        title="Delete Token?"
        message={`Are you sure you want to delete the token "${tokenToDelete?.name}"?`}
        description="This action cannot be undone. The token will be permanently removed from your account."
        confirmText={isDeletingToken ? 'Deleting...' : 'Delete Token'}
        cancelText="Cancel"
        onConfirm={deleteToken}
        onCancel={cancelDelete}
        isLoading={isDeletingToken}
        variant="danger"
      />
    </div>
  );
}
