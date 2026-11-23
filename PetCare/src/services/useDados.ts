import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { api } from './api';
import type { Evento, Pet } from './types';

/* Carrega pets + eventos de todos os pets do tutor. Recarrega toda vez que a tela ganha foco. */
export function useDados() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    setErro(null);
    try {
      const listaPets: Pet[] = (await api.get('/api/pets')) || [];
      const grupos = await Promise.all(
        listaPets.map(async (p) => {
          try {
            const evs: Evento[] = (await api.get(`/api/pets/${p.id}/eventos`)) || [];
            return evs.map((e) => ({ ...e, petNome: p.nome }));
          } catch {
            return [] as Evento[];
          }
        })
      );
      setPets(listaPets);
      setEventos(grupos.flat());
    } catch (e: any) {
      setErro(e.message || 'Falha ao carregar os dados.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      recarregar();
    }, [recarregar])
  );

  return { pets, eventos, loading, erro, recarregar };
}
