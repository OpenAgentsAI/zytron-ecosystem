'use client';

import { Button } from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import { useToast } from '@/shared/components/ui/Toasts/use-toast';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/components/ui/table';
import { openagentsaiApiKey } from '@/shared/models/db-types';
import { formatDate } from '@/shared/utils/helpers';
import { trpc } from '@/shared/utils/trpc/trpc';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import confetti from 'canvas-confetti';

const ApiKeys = () => {
  const apiKeys = trpc.getApiKeys.useQuery();
  const addApiKey = trpc.addApiKey.useMutation();
  const [keyName, setKeyName] = useState<string>('');
  const [generatedKey, setGeneratedKey] = useState<string | null>('');
  const toast = useToast();
  const columns: ColumnDef<Partial<openagentsaiApiKey>>[] = useMemo(() => {
    return [
      {
        accessorKey: 'name',
        header: 'Name'
      },
      {
        accessorKey: 'key',
        header: 'Key'
      },
      {
        accessorKey: 'created_at',
        header: 'Created date',
        cell: (cell) => formatDate(cell.getValue<string>())
      },
      {
        accessorKey: 'id',
        header: 'Actions',
        cell: (cell) => {
          const deleteApiKey = trpc.deleteApiKey.useMutation();
          return (
            <Button
              variant="outline"
              disabled={deleteApiKey.isPending}
              onClick={() => {
                deleteApiKey
                  .mutateAsync(cell.row.original.id as string)
                  .then(() => {
                    apiKeys.refetch();
                    toast.toast({
                      title: 'API key deleted'
                    });
                  });
              }}
            >
              Delete
            </Button>
          );
        }
      }
    ];
  }, []);

  const table = useReactTable({
    data: apiKeys?.data ?? [],
    columns: columns as any,
    getCoreRowModel: getCoreRowModel()
  });

  const generate = () => {
    addApiKey.mutateAsync({ name: keyName }).then((data) => {
      setKeyName('');
      setGeneratedKey(data?.key ?? '');
      apiKeys.refetch();
      toast.toast({
        title: 'API key created'
      });
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    });
  };
  return (
    <>
      <div className="flex flex-col w-5/6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">API keys</h1>
        <span className="mt-4 text-muted-foreground">
          Your secret API keys are listed below. Please note that we do not
          display your secret API keys again after you generate them. Do not
          share your API key with others, or expose it in the browser or other
          client-side code. In order to protect the security of your account,
        </span>
        <div className="mt-4">
          {/* api keys table */}
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {apiKeys.isPending && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {!apiKeys.isPending &&
                (table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setGeneratedKey(null);
                }}
                variant="outline"
                className="shadow-none"
              >
                Create new API key
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {generatedKey ? 'Generated key' : 'Create new API key'}
                </DialogTitle>
                {/* <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription> */}
              </DialogHeader>
              <div className="gap-2 py-4">
                {generatedKey ? (
                  <div>
                    <p className="text-muted-foreground">
                      Please copy the key below. You will not be able to see it
                      again.
                      <br /> You can use it with OpenAI-compatible apps
                    </p>
                    <Input
                      value={generatedKey}
                      className="my-2 w-full"
                      readOnly
                    />
                  </div>
                ) : (
                  <div>
                    <label htmlFor="name" className="text-right">
                      Name
                    </label>
                    <Input
                      id="name"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          generate();
                        }
                      }}
                      value={keyName}
                      className="my-2 w-full"
                      onChange={(value) => {
                        setKeyName(value);
                      }}
                    />
                  </div>
                )}
              </div>

              {!generatedKey && (
                <DialogFooter>
                  <Button
                    disabled={addApiKey.isPending}
                    type="button"
                    onClick={generate}
                  >
                    Generate key
                  </Button>
                </DialogFooter>
              )}
            </DialogContent>
          </Dialog>
        </div>
        <div className="py-8" />
      </div>
    </>
  );
};

export default ApiKeys;
