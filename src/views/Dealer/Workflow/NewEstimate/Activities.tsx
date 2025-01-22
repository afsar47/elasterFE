import classNames from 'classnames'
import Timeline from '@/components/ui/Timeline'
import Badge from '@/components/ui/Badge'
import isLastChild from '@/utils/isLastChild'
import dayjs from 'dayjs'

type Event = {
    time: number
    action: string
    recipient?: string
}

const ActivityData = [
    {
        date: 1646554397,
        events: [
            {
                time: 1646554397,
                action: 'Parcel has been delivered',
                recipient: 'Lloyd Obrien',
            },
            {
                time: 1646537537,
                action: 'Parcel is out for delivery',
            },
            {
                time: 1646529317,
                action: 'Parcel has arrived at delivery station',
            },
        ],
    },
    {
        date: 1646442017,
        events: [
            {
                time: 1646462597,
                action: 'Parcel has been picked up by courier',
            },
            {
                time: 1646537537,
                action: 'Seller is preparing to ship your parcel',
            },
        ],
    },
]

const Activity = () => {
    return (
        <>
            {ActivityData.map((activity, i) => (
                <div
                    key={activity.date}
                    className={!isLastChild(ActivityData, i) ? 'mb-8' : ''}
                >
                    <div className="mb-2 font-semibold uppercase opacity-80">
                        {dayjs.unix(activity.date).format('dddd, DD MMMM')}
                    </div>
                    <Timeline>
                        {activity.events.map((event, j) => (
                            <Timeline.Item
                                key={event.time + j}
                                media={
                                    <div className="flex mt-1.5">
                                        <Badge
                                            innerClass={classNames(
                                                event.recipient
                                                    ? 'bg-emerald-500'
                                                    : 'bg-blue-500'
                                            )}
                                        />
                                    </div>
                                }
                            >
                                <div
                                    className={classNames(
                                        'font-semibold mb-1 text-base',
                                        event.recipient && 'text-emerald-500'
                                    )}
                                >
                                    {event.action}
                                </div>
                                {event.recipient && (
                                    <div className="mb-1">
                                        Recipient: {event.recipient}
                                    </div>
                                )}
                                <div>
                                    {dayjs.unix(event.time).format('hh:mm A')}
                                </div>
                            </Timeline.Item>
                        ))}
                    </Timeline>
                </div>
            ))}
        </>
    )
}

export default Activity
