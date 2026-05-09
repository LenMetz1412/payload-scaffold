'use client'

import { format } from 'date-fns/format'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/sha/button'
import { Calendar } from '@/sha/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/sha/popover'
import { cn } from '@/utils/cn'

import { TimePicker } from './time-picker'

const shouldMaskTime = (input?: Date) => {
  if (!input) return true
  if (input.getMinutes() !== 0 || input.getSeconds() !== 0) return false
  return input.getHours() === 0
}

interface DateTimePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  disabled?: boolean
  placeholder?: string
  handleSave?: (date: Date | undefined) => void | Promise<void>
  onCancel?: () => void
  setDateOnly?: (dateOnly: boolean) => void
  dateOnly: boolean
}

export function DateTimePicker({
  value,
  onChange,
  disabled,
  placeholder = 'Pick a date',
  handleSave,
  onCancel,
  setDateOnly,
  dateOnly,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(value)
  const maskTime = shouldMaskTime(date)
  const isDateOnly = dateOnly || maskTime

  useEffect(() => {
    setDate(value)
  }, [value])

  useEffect(() => {
    if (!value) return
    if (!dateOnly && shouldMaskTime(value)) {
      setDateOnly?.(true)
    }
  }, [value, dateOnly, setDateOnly])

  const handleDateChange = (nextDate: Date | undefined) => {
    setDate(nextDate)
    onChange?.(nextDate)
    if (nextDate && dateOnly && !shouldMaskTime(nextDate)) {
      setDateOnly?.(false)
    }
  }

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              data-empty={!date}
              className={cn(
                'w-[280px] justify-start text-left font-normal data-[empty=true]:text-muted-foreground',
                disabled && 'pointer-events-none',
              )}
            >
              <CalendarIcon />
              {date ? (
                isDateOnly ? (
                  format(date, 'PPP')
                ) : (
                  format(date, 'PPP HH:mm')
                )
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              className="w-full"
            />
            <div className="ml-3 flex flex-row items-center gap-2">
              <input
                type="checkbox"
                checked={dateOnly}
                onChange={() => setDateOnly?.(!dateOnly)}
                placeholder="Date only"
              />
              <span>Date only</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <div className="border-t border-border p-3">
                <TimePicker date={date} setDate={handleDateChange} maskDefaultTime={maskTime} />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  className={cn('rounded-md border px-3 py-1 text-sm', disabled && 'opacity-60')}
                  onClick={async () => {
                    if (disabled) return
                    try {
                      await handleSave?.(date)
                      setOpen(false)
                    } catch (error) {
                      console.error(error)
                    }
                  }}
                  disabled={disabled}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="rounded-md border px-3 py-1 text-sm hover:bg-muted"
                  onClick={() => {
                    if (disabled) return
                    onCancel?.()
                    setOpen(false)
                  }}
                  disabled={disabled}
                >
                  Cancel
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
