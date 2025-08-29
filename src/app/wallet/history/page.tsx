'use client';

import { useState } from 'react';
import { ArrowLeft, Search, Filter, Download, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { useAuth } from '@/hooks/useAuth';

export default function TransactionHistory() {
  const router = useRouter();
  const { transactions, isLoading } = useWallet();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdrawal'>('all');

  const filteredTransactions = transactions?.filter(transaction => {
    const description = transaction.type === 'deposit' ? 'Depósito' : 'Saque';
    const matchesSearch = description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  }) || [];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getTransactionIcon = (type: string) => {
    return type === 'deposit' ? (
      <ArrowDownLeft className="h-5 w-5 text-green-400" />
    ) : (
      <ArrowUpRight className="h-5 w-5 text-red-400" />
    );
  };

  const getTransactionColor = (type: string) => {
    return type === 'deposit' ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Histórico de Transações</h1>
              <p className="text-gray-400">Acompanhe todas as suas movimentações</p>
            </div>
          </div>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#1a1b3a] border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#4fc3f7] focus:border-transparent"
              />
            </div>
            
            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'deposit' | 'withdrawal')}
                className="pl-10 pr-8 py-3 bg-[#1a1b3a] border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#4fc3f7] focus:border-transparent appearance-none"
              >
                <option value="all">Todas</option>
                <option value="deposit">Depósitos</option>
                <option value="withdrawal">Saques</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Carregando transações...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">Nenhuma transação encontrada</p>
            </div>
          ) : (
            <div className="divide-y divide-[#3a3b5a]">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-6 hover:bg-[#1a1b3a] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-[#1a1b3a] rounded-lg">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{transaction.type === 'deposit' ? 'Depósito' : 'Saque'}</h3>
                        <p className="text-sm text-gray-400">
                          {formatDate(transaction.createdAt)}
                        </p>
                        {transaction.paymentMethod && (
                          <p className="text-xs text-gray-500 mt-1">
                            {transaction.paymentMethod.type === 'pix' ? 'PIX' : 'Cartão de Crédito'}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'deposit' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-sm text-gray-400 capitalize">
                        {transaction.status === 'completed' ? 'Concluída' : 
                         transaction.status === 'pending' ? 'Pendente' : 'Cancelada'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {filteredTransactions.length > 0 && (
          <div className="mt-6 bg-[#2a2b4a] rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Resumo do Período</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(
                    filteredTransactions
                      .filter(t => t.type === 'deposit')
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </p>
                <p className="text-sm text-gray-400">Total Depositado</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">
                  {formatCurrency(
                    filteredTransactions
                      .filter(t => t.type === 'withdrawal')
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </p>
                <p className="text-sm text-gray-400">Total Gasto</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">
                  {filteredTransactions.length}
                </p>
                <p className="text-sm text-gray-400">Transações</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}