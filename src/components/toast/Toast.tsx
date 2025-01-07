import { Svg } from "boilerplate-design-system";

export function Toast({
  children,
  status,
  handleClose,
}: {
  children: React.ReactNode;
  status?: "success";
  handleClose?: () => void;
}) {
  const statuses = {
    success: {
      icon: "Checkmark",
      color: "bg-green-500",
    },
  } as const;

  return (
    <div className="rounded-[1rem] bg-grey-900 text-white flex shadow-xl gap-4 p-4 text-14 w-full">
      {status ? (
        <span className="h-[1.25em] flex items-center">
          <span
            className={`flex-shrink-0 size-6 text-white flex items-center justify-center rounded-full ${statuses[status]?.color}`}
          >
            <Svg name={statuses[status]?.icon} className="size-4" />
          </span>
        </span>
      ) : null}
      <div className="text-14 leading-tight flex flex-col w-full">
        {children}
      </div>

      {handleClose ? (
        <span className="h-[1.25em] flex items-center">
          <button
            type="button"
            className="flex-shrink-0 size-6 bg-grey-700 text-white flex items-center justify-center rounded-full"
            onClick={handleClose}
          >
            <Svg name="Close" className="size-4" />{" "}
          </button>
        </span>
      ) : null}
    </div>
  );
}
