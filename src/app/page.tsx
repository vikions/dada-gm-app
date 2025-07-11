'use client';

import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { injected } from 'wagmi/connectors';

// 1. Импортируем ABI из папки artifacts
import CounterABI from '../../artifacts/contracts/Counter.sol/Counter.json';

// 2. Вставьте сюда адрес вашего развернутого контракта
const contractAddress = '0xE1589FB801Ea9dC4293618736e053beDE1cbcF62'; 

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  // Хук для вызова функции 'gm'
  const { data: hash, writeContract } = useWriteContract();

  // Хук для чтения значения 'count'
  const { data: count, refetch } = useReadContract({
    address: contractAddress,
    abi: CounterABI.abi,
    functionName: 'count',
  });

  // Хук, который ждет завершения транзакции
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    })

  // Когда транзакция подтверждена, обновляем счетчик
  useEffect(() => {
    if (isConfirmed) {
      refetch();
    }
  }, [isConfirmed, refetch]);


  const handleGmClick = () => {
    writeContract({
      address: contractAddress,
      abi: CounterABI.abi,
      functionName: 'gm',
    });
  };

  if (isConnected) {
    return (
      <div style={styles.container}>
        <p>Ваш кошелек: {address}</p>
        <p style={styles.countText}>Счетчик GM: {count?.toString() ?? 'Загрузка...'}</p>
        <button style={styles.button} onClick={handleGmClick} disabled={isConfirming}>
          {isConfirming ? 'Отправка...' : 'Отправить GM'}
        </button>
        {hash && <p>Хэш транзакции: {hash}</p>}
        {isConfirmed && <p>Транзакция подтверждена!</p>}
        <button style={styles.button} onClick={() => disconnect()}>Отключить кошелек</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button style={styles.button} onClick={() => connect({ connector: injected() })}>
        Подключить кошелек
      </button>
    </div>
  );
}

// Простые стили для наглядности
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '20px',
    background: '#111',
    color: 'white',
    fontFamily: 'sans-serif',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '8px',
    border: 'none',
  },
  countText: {
    fontSize: '24px',
    fontWeight: 'bold',
  }
};