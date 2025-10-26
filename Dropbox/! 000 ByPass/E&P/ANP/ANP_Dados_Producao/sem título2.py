# --- MÉTODO CORRIGIDO ---
    def process_files(self):
        try:
            self.log_message("="*50, clear=True)
            self.log_message("🚀 INICIANDO PROCESSAMENTO...")
            self.log_message("="*50)
            
            self.log_message("Combinando todos os arquivos...")
            all_data = pd.concat(self.data_frames, ignore_index=True)
            
            self.log_message("Agrupando dados por Campo...")
            
            # Garante que a coluna Campo exista e trata valores vazios
            if 'Campo' not in all_data.columns:
                 raise KeyError("Coluna 'Campo' não encontrada após unificação dos dados.")
                 
            # 4. Agrupamento estratégico: agrupa primeiro por campo
            grouped_by_field = all_data.groupby('Campo', dropna=False) # dropna=False garante que campos 'NaN' sejam processados
            
            total_campos = len(grouped_by_field)
            self.log_message(f"Total de campos a processar: {total_campos}")
            
            processed_count = 0
            
            # 5. Processar cada Campo
            for idx_c, (campo_nome, campo_data) in enumerate(grouped_by_field, 1):
                # Usa a nova função auxiliar e Pathlib para segurança do caminho
                campo_dir_name = self._clean_filename(campo_nome)
                campo_dir_path = Path(self.output_dir) / campo_dir_name
                campo_dir_path.mkdir(parents=True, exist_ok=True) # Cria a pasta
                
                # Agrupar por POÇO dentro do campo
                grouped_by_well = campo_data.groupby('Nome_Poco')
                
                # Processar cada poço dentro do campo
                for poco_nome, poco_data in grouped_by_well:
                    
                    poco_nome_clean = self._clean_filename(poco_nome)
                    
                    # Ordenar por Período (que agora é Datetime)
                    if 'Período' in poco_data.columns:
                        poco_data = poco_data.sort_values('Período')
                        
                        # <<< CORREÇÃO DA LINHA 206: REMOVENDO A COLUNA DATETIME >>>
                        # Remove a coluna Datetime após usá-la para ordenação.
                        # Isso garante que a coluna Periodo_Str (a string original) seja usada no CSV,
                        # evitando o erro de formatação na escrita.
                        poco_data = poco_data.drop(columns=['Período']) 
                        
                    # Salvar arquivo do poço
                    output_file = campo_dir_path / f"{poco_nome_clean}.csv"
                    # Salva usando os mesmos delimitadores de entrada
                    poco_data.to_csv(output_file, index=False, sep=';', decimal=',', encoding='latin-1')
                    
                    processed_count += 1
                
                # Log de progresso
                if idx_c % 1 == 0 or idx_c == total_campos:
                    self.log_message(f"Processando Campos: {idx_c}/{total_campos}. Poços salvos até agora: {processed_count}")

            self.log_message("="*50)
            self.log_message("✅ PROCESSAMENTO CONCLUÍDO COM SUCESSO!")
            self.log_message("="*50)
            self.log_message(f"Total de poços processados: {processed_count}")
            self.log_message(f"Arquivos salvos em: {self.output_dir}")
            
            self.root.after(0, lambda: messagebox.showinfo(
                "Sucesso!", 
                f"Processamento concluído!\n\n"
                f"Total de poços: {processed_count}\n"
                f"Arquivos salvos em:\n{self.output_dir}"
            ))

        except Exception as e:
            self.log_message(f"❌ ERRO: {str(e)}")
            self.root.after(0, lambda: messagebox.showerror("Erro", f"Erro durante processamento:\n{str(e)}"))
        
        finally:
            self.root.after(0, self.finish_processing)