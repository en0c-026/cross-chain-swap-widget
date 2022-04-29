import React from 'react'
import { Button } from 'grommet';
import { Moon, Sun } from 'grommet-icons';

interface ThemeSelectorProps {
  themeMode: 'dark' | 'light';
  setThemeMode: (mode: 'dark' | 'light') => void;
}

export const ThemeSelector = ({
  themeMode,
  setThemeMode
}: ThemeSelectorProps) => {
  return (
    <Button
      onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
      label={themeMode === 'dark' ? <Sun size='16px' /> : <Moon size='16px' />}
      plain
    />
  )
}